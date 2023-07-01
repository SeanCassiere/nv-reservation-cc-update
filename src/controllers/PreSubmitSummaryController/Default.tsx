import React, { useMemo, lazy } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import { Button as UIButton } from "@/components/ui/button";

import { useAppNavContext } from "../../hooks/logic/useAppNavContext";
import { useFormStore } from "../../hooks/stores/useFormStore";

const Alert = lazy(() => import("../../components/Elements/Default/Alert"));
const CreditCardFormSummary = lazy(() => import("../../components/FormSummary/CreditCard"));
const DriverLicenseFormSummary = lazy(() => import("../../components/FormSummary/DriverLicense"));
const RentalSignatureFormSummary = lazy(() => import("../../components/FormSummary/RentalSignature"));

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
        {isEmpty && <Alert color="warning">{t("forms.formsSummary.noData")}</Alert>}
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
