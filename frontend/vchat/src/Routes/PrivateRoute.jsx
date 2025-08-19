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
  const logout = useLogout();
  const dispatch = useDispatch();
  const location = useLocation();

  const { access_token, refresh_token, user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      if (!access_token && !refresh_token) {
        dispatch(removeLogin());
        logout();
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // If access token is valid
      if (access_token && isTokenValid(access_token)) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Try to refresh token if access token is invalid
      if (refresh_token && isTokenValid(refresh_token)) {
        try {
          const response = await api.post("token/refresh/", {
            refresh: refresh_token,
          });

          const newAccessToken = response?.data?.access;
          const newRefreshToken = response?.data?.refresh || refresh_token;

          if (newAccessToken && isTokenValid(newAccessToken)) {
            dispatch(
              saveLogin({
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                user,
                is_login: true,
              })
            );
            setIsAuthenticated(true);
          } else {
            throw new Error("New access token is invalid.");
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          dispatch(removeLogin());
          logout();
          setIsAuthenticated(false);
        }
      } else {
        dispatch(removeLogin());
        logout();
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    validateToken();
  }, [access_token, refresh_token, dispatch, api, user, logout]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader size={50} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
