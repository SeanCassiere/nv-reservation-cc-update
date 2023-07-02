import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./app-entry";
import "./i18n";
import LoadingSubmission from "./pages/LoadingSubmission/LoadingSubmission";

const documentElement = document.getElementById("root");

if (!documentElement) {
  throw new Error('Could not find document element with id "root"');
}

ReactDOM.createRoot(documentElement).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSubmission title=" " />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
