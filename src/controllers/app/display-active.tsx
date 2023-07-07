import React, { memo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import { Button as UIButton } from "@/components/ui/button";

import LoadingSubmission from "@/pages/loading-submission";

import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { APP_CONSTANTS } from "@/utils/constants";

const CcControllerDefault = lazy(() => import("../cc-default"));
const LicenseUplControllerDefault = lazy(() => import("../license-upload-default"));

const CcAndLicenseUplControllerDefault = lazy(() => import("../cc-and-license-upload-default"));

const RentalSignatureControllerDefault = lazy(() => import("../rental-signature-default"));
const RentalSummaryControllerDefault = lazy(() => import("../rental-charges-summary-default"));

const PreSubmitSummaryControllerDefault = lazy(() => import("../pre-submit-summary-default"));

const DisplayActiveController: React.FC = () => {
  const { t } = useTranslation();
  const { activeController } = useAppNavContext();

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {activeController === APP_CONSTANTS.FLOW_CREDIT_CARD_FORM && <CcControllerDefault />}
        {activeController === APP_CONSTANTS.FLOW_DEFAULT_LICENSE_UPLOAD_FORM && <LicenseUplControllerDefault />}
        {activeController === APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM && (
          <CcAndLicenseUplControllerDefault />
        )}
        {activeController === APP_CONSTANTS.FLOW_RENTAL_SIGNATURE_FORM && <RentalSignatureControllerDefault />}
        {activeController === APP_CONSTANTS.FLOW_RENTAL_CHARGES_FORM && <RentalSummaryControllerDefault />}
        {activeController === APP_CONSTANTS.FLOW_FORMS_SUMMARY && <PreSubmitSummaryControllerDefault />}
        {activeController === APP_CONSTANTS.FLOW_DEV_SCREEN_1 && <DevScreen title={APP_CONSTANTS.FLOW_DEV_SCREEN_1} />}
        {activeController === APP_CONSTANTS.FLOW_DEV_SCREEN_2 && <DevScreen title={APP_CONSTANTS.FLOW_DEV_SCREEN_2} />}
      </Suspense>
    </React.Fragment>
  );
};

export default memo(DisplayActiveController);

const DevScreen = memo((props: { title: string }) => {
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext } = useAppNavContext();
  return (
    <CardLayout title={props.title} subtitle={`This is the description for ${props.title}.`}>
      <div className="mt-5 flex gap-1">
        <UIButton type="button" variant="outline" disabled={!isPreviousAvailable} onClick={goPrev}>
          {prevPageText}
        </UIButton>
        <UIButton type="button" className="w-full" onClick={goNext}>
          {nextPageText}
        </UIButton>
      </div>
    </CardLayout>
  );
});
