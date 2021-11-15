import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireAuth from "./RequireAuth";
import NotAuthorized from "../views/NotAuthorized/NotAuthorized";
import ControllerCreditCardForm from "../views/CreditCardForm/ControllerCreditCardForm";

const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<ControllerCreditCardForm />} />
				<Route
					path='/authorized'
					element={
						<RequireAuth>
							<ControllerCreditCardForm />
						</RequireAuth>
					}
				/>
				<Route path='/not-authorized' element={<NotAuthorized />} />
				<Route path='*' element={<NotAuthorized />} />
			</Routes>
		</BrowserRouter>
	);
};

export default AppRoutes;
