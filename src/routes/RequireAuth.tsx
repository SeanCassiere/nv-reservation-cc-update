import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { selectAuthState, selectSubmissionState } from "../shared/redux/store";

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  let location = useLocation();
  const { access_token } = useSelector(selectAuthState);
  const { state, isSubmissionAttempted } = useSelector(selectSubmissionState);

  if (!access_token) {
    return <Navigate to="/not-available" replace state={{ from: location }} />;
  }

  if (isSubmissionAttempted && state === "submitting_details_error") {
    return <Navigate to="/error" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
