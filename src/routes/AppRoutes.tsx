import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import RequireAuth from "./RequireAuth";
import NotAuthorized from "../shared/pages/NotAuthorized/NotAuthorized";
import ApplicationController from "../shared/controllers/ApplicationController/ApplicationController";
import DefaultSubmitDetailsController from "../shared/controllers/SubmitDetailsController/DefaultSubmitDetailsController";
import SuccessSubmission from "../shared/pages/SuccessSubmission/SuccessSubmission";
import ErrorSubmission from "../shared/pages/ErrorSubmission/ErrorSubmission";
import NavigateToNotAvailable from "./NavigateToNotAvailable";

import { selectConfigState } from "../shared/redux/store";

const AppRoutes = () => {
	const appConfig = useSelector(selectConfigState);
	const { t } = useTranslation();

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
							<SuccessSubmission referenceType={appConfig.referenceType} />
						</RequireAuth>
					}
				/>
				<Route path='/error' element={<ErrorSubmission msg={t("badSubmission.message")} tryAgainButton />} />
				<Route path='/not-available' element={<NotAuthorized />} />
				<Route path='*' element={<NavigateToNotAvailable />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
