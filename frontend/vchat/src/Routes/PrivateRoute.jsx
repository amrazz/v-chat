import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { HashLoader } from "react-spinners";
import useApi from "../useApi";
import { saveLogin, removeLogin } from "../store/slice";
import useLogout from "../pages/useLogout";

const PrivateRoute = ({ children }) => {
  const api = useApi();
  const logout = useLogout()
  const dispatch = useDispatch();
  const location = useLocation();
  const { access_token, refresh_token, user } = useSelector(
    (state) => state.auth
  );

  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      try {
        setIsValidating(true);

        //  if not token at all ->

        if (!access_token && !refresh_token) {
          dispatch(removeLogin());
          setIsAuthenticated(false);
          setIsValidating(false);
          logout()
          return;
        }

        let accessValid = false;

        //   check access token validity

        if (access_token) {
          try {
            const decoded = jwtDecode(access_token);
            if (decoded.exp > Date.now() / 1000) {
              accessValid = true;
            }
          } catch (err) {
            console.warn("Failed to decode access token:", err);
          }
        }

        if (accessValid) {
          setIsAuthenticated(true);
          setIsValidating(true);
          return;
        }

        // Access token is missing or expired, try refresh token

        if (refresh_token) {
          try {
            console.log("Trying to refresh token:", refresh_token);
            const res = await api.post("token/refresh/", {
              refresh: refresh_token,
            });

            if (res?.data?.access) {
              const decoded = jwtDecode(res.data.access);
              if (decoded.exp > Date.now() / 1000) {
                dispatch(
                  saveLogin({
                    access_token: res.data.access,
                    refresh_token: res.data.refresh || refresh_token,
                    user,
                    is_login: true,
                  })
                );
                setIsAuthenticated(true);
                setIsValidating(false);
                return;
              }
            }
          } catch (error) {
            console.log(
              "Refresh token failed:",
              error?.response?.data || error.message
            );
          }
        }

        setIsAuthenticated(false);
        setIsValidating(false);
        logout()
      } catch (error) {
        console.error("Error while authenticating...");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [access_token, refresh_token, dispatch, api, user]);

  if (isValidating) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader size={50} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
