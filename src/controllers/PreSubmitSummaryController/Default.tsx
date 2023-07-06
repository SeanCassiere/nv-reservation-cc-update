import React, { useMemo, lazy } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import { Button as UIButton } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationIcon } from "@/components/ui/icons";

import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useFormStore } from "@/hooks/stores/useFormStore";

const CreditCardFormSummary = lazy(() => import("../../components/form-details-summary/credit-card-summary"));
const DriverLicenseFormSummary = lazy(() => import("../../components/form-details-summary/driver-license-summary"));
const RentalSignatureFormSummary = lazy(() => import("../../components/form-details-summary/rental-signature-summary"));

const PreSubmitSummaryControllerDefault: React.FC = () => {
  const { t } = useTranslation();
  const { nextPageText, goNext, goToEditAPage } = useAppNavContext();

  const { isFilled: isCreditCard, data: creditCardInfo } = useFormStore((s) => s.customerCreditCard);
  const { isFilled: isDriverLicense, data: driversLicense } = useFormStore((s) => s.driversLicense);
  const { isFilled: isRentalSignature, data: rentalSignature } = useFormStore((s) => s.rentalSignature);

  const isEmpty = useMemo(
    () => isCreditCard === false && isDriverLicense === false && isRentalSignature === false,
    [isCreditCard, isDriverLicense, isRentalSignature]
  );

  return (
    <CardLayout title={t("forms.formsSummary.title")} subtitle={t("forms.formsSummary.message")}>
      <div className="mt-4">
        {isEmpty && (
          <Alert className="mb-2" variant="warning">
            <ExclamationIcon />
            <AlertTitle>{t("forms.formsSummary.missing")}</AlertTitle>
            <AlertDescription>{t("forms.formsSummary.noData")}</AlertDescription>
          </Alert>
        )}
        {isCreditCard && (
          <CreditCardFormSummary creditCard={creditCardInfo} editFunc={() => goToEditAPage("creditCard")} />
        )}
        {isDriverLicense && (
          <DriverLicenseFormSummary driverLicense={driversLicense} editFunc={() => goToEditAPage("driversLicense")} />
        )}
        {isRentalSignature && (
          <RentalSignatureFormSummary
            rentalSignature={rentalSignature}
            editFunc={() => goToEditAPage("rentalSignature")}
          />
        )}
      </div>
      <div className="mt-6 flex">
        <div className={"flex-1"}>
          <UIButton className="w-full" size="lg" onClick={goNext}>
            {nextPageText}
          </UIButton>
        </div>
      </div>
    </CardLayout>
  );
};

export default PreSubmitSummaryControllerDefault;
