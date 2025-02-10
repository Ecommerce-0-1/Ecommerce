import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserCookies } from "../utils/methods";

const ProtectedRoute = ({ allowedRoles }) => {
  const userData = getUserCookies();
  const isAuthorized = allowedRoles.includes(userData?.role);

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;
