import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { selectConfigState } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";

import LoadingSubmission from "../LoadingSubmission/LoadingSubmission";

const SubmissionSuccessDefaultLayout = lazy(
  () => import("../../layouts/SubmissionSuccess/SubmissionSuccessDefaultLayout")
);

const SuccessSubmissionPage: React.FC = () => {
  const { t } = useTranslation();
  const appConfig = useSelector(selectConfigState);

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {appConfig.successSubmissionScreen === APP_CONSTANTS.SUCCESS_SCREEN_TEST && <TestSubmissionLayout />}
        {appConfig.successSubmissionScreen === APP_CONSTANTS.SUCCESS_SCREEN_DEFAULT && (
          <SubmissionSuccessDefaultLayout />
        )}
      </Suspense>
    </React.Fragment>
  );
};

export default SuccessSubmissionPage;

const TestSubmissionLayout = () => {
  return (
    <div>
      <h2>Test Success Submission</h2>
      <p>submission successful</p>
    </div>
  );
};
