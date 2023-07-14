import React from "react";
import { useSelector, UseSelector } from "react-redux/es/hooks/useSelector";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace/>;
};

export default PrivateRoutes;
