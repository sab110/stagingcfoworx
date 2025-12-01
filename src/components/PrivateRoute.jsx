// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protects private routes — only allow access if token + user_id exist.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("user_id");

  if (!token || !userId) {
    // redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
