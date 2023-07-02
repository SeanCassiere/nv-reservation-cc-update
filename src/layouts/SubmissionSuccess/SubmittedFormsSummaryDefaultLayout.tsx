import React, { lazy, useMemo } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { useFormStore } from "@/hooks/stores/useFormStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { APP_CONSTANTS, SuccessImgUri } from "@/utils/constants";
import { ExclamationIcon } from "@/components/icons";

const RentalChargesSummaryList = lazy(() => import("../../components/rental-charges-summary-list"));
const CreditCardSummary = lazy(() => import("../../components/form-details-summary/credit-card-summary"));
const DriverLicenseSummary = lazy(() => import("../../components/form-details-summary/driver-license-summary"));
const RentalSignatureSummary = lazy(() => import("../../components/form-details-summary/rental-signature-summary"));

export type SubmittedFormsSummaryDefaultLayoutProps = {
  includeRentalChargesSummary?: boolean;
};

const SubmittedFormsSummaryDefaultLayout: React.FC = (props: SubmittedFormsSummaryDefaultLayoutProps) => {
  const { t } = useTranslation();

  const { referenceIdentifier, referenceType, clientId } = useRuntimeStore();

  const { isFilled: isCreditCard, data: creditCardInfo } = useFormStore((s) => s.customerCreditCard);
  const { isFilled: isDriverLicense, data: driversLicense } = useFormStore((s) => s.driversLicense);
  const { isFilled: isRentalSignature, data: rentalSignature } = useFormStore((s) => s.rentalSignature);

  const isEmpty = useMemo(
    () => isCreditCard === false && isDriverLicense === false && isRentalSignature === false,
    [isCreditCard, isDriverLicense, isRentalSignature]
  );

  return (
    <CardLayout title={t("successSubmission.title")} image={SuccessImgUri}>
      <div className="mt-4">
        {isEmpty && (
          <Alert className="mb-1" variant="warning">
            <ExclamationIcon />
            <AlertTitle>Missing</AlertTitle>
            <AlertDescription>{t("forms.formsSummary.noData", { context: "submitted" })}</AlertDescription>
          </Alert>
        )}
        {!isEmpty && (
          <>
            <div className="text-md pb-1 pt-2 font-medium text-primary">
              {t("forms.formsSummary.title", { context: "submitted" })}
            </div>
            <div className="pb-4 pt-1 text-sm text-primary">
              {t("forms.formsSummary.message", { context: "submitted" })}
            </div>
          </>
        )}
        {isCreditCard && <CreditCardSummary creditCard={creditCardInfo} />}
        {isDriverLicense && <DriverLicenseSummary driverLicense={driversLicense} />}
        {isRentalSignature && <RentalSignatureSummary rentalSignature={rentalSignature} />}
      </div>
      {props.includeRentalChargesSummary && clientId && referenceIdentifier && (
        <div className="mt-4 border-t border-t-gray-100 pt-4">
          <h3 className="text-md font-medium text-primary">
            {t("forms.rentalSummary.title", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </h3>
          <div className="pb-4 pt-2 text-sm text-primary">
            {t("forms.rentalSummary.message", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </div>
          <RentalChargesSummaryList
            clientId={clientId}
            referenceType={referenceType}
            referenceId={referenceIdentifier}
          />
        </div>
      )}
    </CardLayout>
  );
};

export default SubmittedFormsSummaryDefaultLayout;
