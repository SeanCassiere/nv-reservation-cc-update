import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ApplicationController from "@/controllers/app";
import ErrorSubmission from "@/pages/error-submission";
import LoadingSubmission from "@/pages/loading-submission";
import NotAuthorized from "@/pages/not-authorized";
import SuccessSubmissionPage from "@/pages/success-submission";

import NavigateToNotAvailable from "./navigate-to-not-available";
import RequireAuth from "./require-auth";

const PostFormDataController = lazy(() => import("../controllers/submit-form-data"));

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
              <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
                <PostFormDataController />
              </Suspense>
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
        <Route
          path="/error"
          element={
            <ErrorSubmission
              msg={t("badSubmission.message")}
              tryAgainButton
              tryAgainButtonText={t("badSubmission.btnRetrySubmission", {}) as string}
            />
          }
        />
        <Route path="/not-available" element={<NotAuthorized />} />
        <Route path="*" element={<NavigateToNotAvailable />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
