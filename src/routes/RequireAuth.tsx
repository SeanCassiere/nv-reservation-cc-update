import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { selectConfigState } from "../shared/redux/store";

function RequireAuth({ children }: { children: JSX.Element }) {
	let location = useLocation();
	const { token } = useSelector(selectConfigState);

	if (!token) {
		return <Navigate to='/not-available' state={{ from: location }} />;
	}

	return children;
}

export default RequireAuth;
