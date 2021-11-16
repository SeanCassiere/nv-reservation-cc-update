import { BrowserRouter, Routes, Route } from "react-router-dom";

// import RequireAuth from "./RequireAuth";
import NotAuthorized from "../shared/pages/NotAuthorized/NotAuthorized";
import ApplicationController from "../shared/controllers/ApplicationController/ApplicationController";
import DefaultSubmitDetailsController from "../shared/controllers/SubmitDetailsController/DefaultSubmitDetailsController";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<ApplicationController />} />
				<Route
					path='/submit-details'
					element={
						// <RequireAuth>
						<DefaultSubmitDetailsController />
						// </RequireAuth>
					}
				/>
				<Route path='/not-authorized' element={<NotAuthorized />} />
				<Route path='*' element={<NotAuthorized />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
