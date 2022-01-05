import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { selectConfigState, selectSubmissionState } from "../shared/redux/store";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
	let location = useLocation();
	const { tokenV3 } = useSelector(selectConfigState);
	const { state, isSubmissionAttempted } = useSelector(selectSubmissionState);

	if (!tokenV3) {
		return <Navigate to='/not-available' replace state={{ from: location }} />;
	}

	if (isSubmissionAttempted && state === "submitting_details_error") {
		return <Navigate to='/error' replace state={{ from: location }} />;
	}

	return children;
};

export default RequireAuth;
