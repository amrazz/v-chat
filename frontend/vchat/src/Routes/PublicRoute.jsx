import React from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const PublicRoute = ({ children }) => {
  const { is_login, access_token } = useSelector((state) => state.auth);

  if (is_login && access_token) {
    try {
      const decoded = jwtDecode(access_token);
      if (decoded.exp > Date.now() / 1000 + 5) {
        return <Navigate to="/home" replace />;
      }
    } catch (err) {
      toast.error(err)
      console.error(err)
    }
  }

  return children
};

export default PublicRoute;
