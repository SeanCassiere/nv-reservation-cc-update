import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./shared/assets/bootstrap.min.css";
import "./shared/assets/overwrite.css";
import App from "./App";
import store from "./shared/redux/store";
import "./i18n";
import LoadingSubmission from "./shared/pages/LoadingSubmission/LoadingSubmission";

ReactDOM.render(
	<React.StrictMode>
		<Suspense fallback={<LoadingSubmission title='' />}>
			<Provider store={store}>
				<App />
			</Provider>
		</Suspense>
	</React.StrictMode>,
	document.getElementById("root")
);
