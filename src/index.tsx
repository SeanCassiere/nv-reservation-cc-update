import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import "./i18n";
import LoadingSubmission from "./pages/LoadingSubmission/LoadingSubmission";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSubmission title="" />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
