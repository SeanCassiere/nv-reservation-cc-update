import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import NotAuthorized from "../shared/pages/NotAuthorized/NotAuthorized";
import ApplicationController from "../shared/controllers/ApplicationController/ApplicationController";
import DefaultSubmitDetailsController from "../shared/controllers/SubmitDetailsController/DefaultSubmitDetailsController";
import SuccessSubmission from "../shared/pages/SuccessSubmission/SuccessSubmission";
import ErrorSubmission from "../shared/pages/ErrorSubmission/ErrorSubmission";
import { useSelector } from "react-redux";
import { selectTranslations } from "../shared/redux/store";

const AppRoutes = () => {
	const t = useSelector(selectTranslations);
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<ApplicationController />} />
				<Route
					path='/submit-details'
					element={
						<RequireAuth>
							<DefaultSubmitDetailsController />
						</RequireAuth>
					}
				/>
				<Route
					path='/success'
					element={
						<RequireAuth>
							<SuccessSubmission />
						</RequireAuth>
					}
				/>
				<Route path='/error' element={<ErrorSubmission msg={t.bad_submission.message} />} />
				<Route path='/not-available' element={<NotAuthorized />} />
				<Route path='*' element={<Navigate to='/not-available' />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
