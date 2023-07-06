import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import LoadingSubmission from "@/pages/LoadingSubmission/LoadingSubmission";

import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { APP_CONSTANTS } from "@/utils/constants";
import type { SubmittedFormsSummaryDefaultLayoutProps } from "@/layouts/SubmissionSuccess/SubmittedFormsSummaryDefaultLayout";

const SubmissionSuccessDefaultLayout = lazy(
  () => import("../layouts/SubmissionSuccess/SubmissionSuccessDefaultLayout")
);
const RentalChargesSummarySuccessDefaultLayout = lazy(
  () => import("../layouts/SubmissionSuccess/RentalChargesSummarySuccessDefaultLayout")
);
const SubmittedFormsSummaryDefaultLayout = lazy<React.FC<SubmittedFormsSummaryDefaultLayoutProps>>(
  () => import("../layouts/SubmissionSuccess/SubmittedFormsSummaryDefaultLayout")
);

const SuccessSubmissionPage: React.FC = () => {
  const { t } = useTranslation();
  const submissionSuccessScreen = useConfigStore((s) => s.successSubmissionScreen);

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_TEST && <TestSubmissionLayout />}
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_SUBMITTED_FORMS_SUMMARY && (
          <SubmittedFormsSummaryDefaultLayout />
        )}
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_SUBMITTED_FORMS_WITH_RENTAL_CHARGES_SUMMARY && (
          <SubmittedFormsSummaryDefaultLayout includeRentalChargesSummary />
        )}
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_DEFAULT && <SubmissionSuccessDefaultLayout />}
        {submissionSuccessScreen === APP_CONSTANTS.SUCCESS_RENTAL_CHARGES_SUMMARY && (
          <RentalChargesSummarySuccessDefaultLayout />
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