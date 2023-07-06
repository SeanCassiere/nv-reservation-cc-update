import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const location = useLocation();

  const access_token = useAuthStore((s) => s.access_token);
  const detailsHaveBeenSubmitted = useRuntimeStore((s) => s.detailsHaveBeenSubmitted);

  if (!access_token && !detailsHaveBeenSubmitted) {
    return <Navigate to="/not-available" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
