import React, { lazy, useMemo } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationIcon } from "@/components/ui/icons";

import { useClientProfileQuery } from "@/hooks/network/useClientProfile";
import { useRentalSummaryQuery } from "@/hooks/network/useRentalSummary";
import { useFormStore } from "@/hooks/stores/useFormStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { APP_CONSTANTS, SuccessImgUri } from "@/utils/constants";

const RentalChargesSummaryList = lazy(() => import("../../components/rental-charges-summary-list"));
const CreditCardSummary = lazy(() => import("../../components/form-details-summary/credit-card-summary"));
const DriverLicenseSummary = lazy(() => import("../../components/form-details-summary/driver-license-summary"));
const RentalSignatureSummary = lazy(() => import("../../components/form-details-summary/rental-signature-summary"));

export type SubmittedFormsSummaryDefaultLayoutProps = {
  includeRentalChargesSummary?: boolean;
};

const SubmittedFormsSummaryDefaultLayout: React.FC = (props: SubmittedFormsSummaryDefaultLayoutProps) => {
  const { t } = useTranslation();

  const { clientId, referenceIdentifier, referenceType } = useRuntimeStore();

  const { isFilled: isCreditCard, data: creditCardInfo } = useFormStore((s) => s.customerCreditCard);
  const { isFilled: isDriverLicense, data: driversLicense } = useFormStore((s) => s.driversLicense);
  const { isFilled: isRentalSignature, data: rentalSignature } = useFormStore((s) => s.rentalSignature);

  const isEmpty = useMemo(
    () => isCreditCard === false && isDriverLicense === false && isRentalSignature === false,
    [isCreditCard, isDriverLicense, isRentalSignature],
  );

  const rentalSummaryQuery = useRentalSummaryQuery({
    clientId: String(clientId),
    referenceId: String(referenceIdentifier),
    referenceType,
  });

  const clientProfileQuery = useClientProfileQuery({ clientId: String(clientId) });

  return (
    <CardLayout title={t("successSubmission.title")} image={SuccessImgUri}>
      <div className="mt-4">
        {isEmpty && (
          <Alert className="mb-2" variant="warning">
            <ExclamationIcon />
            <AlertTitle>{t("forms.formsSummary.missing")}</AlertTitle>
            <AlertDescription>{t("forms.formsSummary.noData", { context: "submitted" })}</AlertDescription>
          </Alert>
        )}
        {!isEmpty && (
          <>
            <div className="text-md pb-1 pt-2 font-medium text-foreground">{t("forms.formsSummary.title")}</div>
            <div className="pb-4 pt-1 text-sm text-foreground">
              {t("forms.formsSummary.message", { context: "submitted" })}
            </div>
          </>
        )}
        {isCreditCard && <CreditCardSummary creditCard={creditCardInfo} />}
        {isDriverLicense && <DriverLicenseSummary driverLicense={driversLicense} />}
        {isRentalSignature && <RentalSignatureSummary rentalSignature={rentalSignature} />}
      </div>
      {props.includeRentalChargesSummary && clientId && referenceIdentifier && (
        <div className="mt-4 border-t border-t-muted pt-4">
          <h3 className="text-md font-medium text-foreground">
            {t("forms.rentalSummary.title", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </h3>
          <div className="pb-4 pt-2 text-sm text-foreground">
            {t("forms.rentalSummary.message", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </div>
          <RentalChargesSummaryList
            referenceType={referenceType}
            summary={rentalSummaryQuery.status === "success" ? rentalSummaryQuery.data : null}
            clientProfile={clientProfileQuery.status === "success" ? clientProfileQuery.data : null}
          />
        </div>
      )}
    </CardLayout>
  );
};

export default SubmittedFormsSummaryDefaultLayout;
