import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import LoadingSubmission from "../LoadingSubmission/LoadingSubmission";

import { useConfigStore } from "../../hooks/stores/useConfigStore";
import { APP_CONSTANTS } from "../../utils/constants";

const SubmissionSuccessDefaultLayout = lazy(
  () => import("../../layouts/SubmissionSuccess/SubmissionSuccessDefaultLayout")
);
const RentalSummarySuccessDefaultLayout = lazy(
  () => import("../../layouts/SubmissionSuccess/RentalSummarySuccessDefaultLayout")
);

const SuccessSubmissionPage: React.FC = () => {
  const { t } = useTranslation();
  const submissionSuccessScreen = useConfigStore((s) => s.successSubmissionScreen);

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_TEST && <TestSubmissionLayout />}
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_DEFAULT && <SubmissionSuccessDefaultLayout />}
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_RENTAL_CHARGES_SUMMARY && (
          <RentalSummarySuccessDefaultLayout />
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
