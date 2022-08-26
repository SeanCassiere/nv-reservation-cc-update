import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import RequireAuth from "./RequireAuth";
import NotAuthorized from "../pages/NotAuthorized/NotAuthorized";
import ApplicationController from "../controllers/ApplicationController/ApplicationController";
import DefaultSubmitDetailsController from "../controllers/SubmitDetailsController/DefaultSubmitDetailsController";
import SuccessSubmissionPage from "../pages/SuccessSubmission/SuccessSubmission";
import ErrorSubmission from "../pages/ErrorSubmission/ErrorSubmission";
import NavigateToNotAvailable from "./NavigateToNotAvailable";

const AppRoutes: React.FC = () => {
  const { t } = useTranslation();

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ApplicationController />} />
        <Route
          path="/submit-details"
          element={
            <RequireAuth>
              <DefaultSubmitDetailsController />
            </RequireAuth>
          }
        />
        <Route
          path="/success"
          element={
            <RequireAuth>
              <SuccessSubmissionPage />
            </RequireAuth>
          }
        />
        <Route path="/error" element={<ErrorSubmission msg={t("badSubmission.message")} tryAgainButton />} />
        <Route path="/not-available" element={<NotAuthorized />} />
        <Route path="*" element={<NavigateToNotAvailable />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
