import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { is_login, access_token } = useSelector((state) => state.auth);

  if (is_login && access_token) {
    return <Navigate to="/home" replace />;
  }

  return children
};

export default PublicRoute;
