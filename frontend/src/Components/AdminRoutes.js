import React from "react";
import { useSelector, UseSelector } from "react-redux/es/hooks/useSelector";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoutes;
