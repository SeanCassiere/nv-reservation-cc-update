import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const NavigateToNotAvailable: React.FC = () => {
  const location = useLocation();
  return <Navigate to="/not-available" state={{ from: location }} replace />;
};

export default NavigateToNotAvailable;
