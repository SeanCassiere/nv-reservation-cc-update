import { Navigate, useLocation } from "react-router-dom";

const NavigateToNotAvailable = () => {
	const location = useLocation();
	return <Navigate to='/not-available' state={{ from: location }} replace />;
};

export default NavigateToNotAvailable;
