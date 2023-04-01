import React, { lazy, useMemo } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../Card";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { APP_CONSTANTS, SuccessImgUri } from "../../utils/constants";

const Alert = lazy(() => import("../../components/Elements/Default/Alert"));
const DefaultRentalSummary = lazy(() => import("../../components/RentalSummary/Default"));
const CreditCardFormSummary = lazy(() => import("../../components/FormSummary/CreditCard"));
const DriverLicenseFormSummary = lazy(() => import("../../components/FormSummary/DriverLicense"));
const RentalSignatureFormSummary = lazy(() => import("../../components/FormSummary/RentalSignature"));

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
        {isEmpty && <Alert color="warning">{t("forms.formsSummary.noData", { context: "submitted" })}</Alert>}
        {!isEmpty && (
          <>
            <div className="text-md pb-1 pt-2 font-medium text-gray-600">
              {t("forms.formsSummary.title", { context: "submitted" })}
            </div>
            <div className="pb-4 pt-1 text-sm text-gray-500">
              {t("forms.formsSummary.message", { context: "submitted" })}
            </div>
          </>
        )}
        {isCreditCard && <CreditCardFormSummary creditCard={creditCardInfo} />}
        {isDriverLicense && <DriverLicenseFormSummary driverLicense={driversLicense} />}
        {isRentalSignature && <RentalSignatureFormSummary rentalSignature={rentalSignature} />}
      </div>
      {props.includeRentalChargesSummary && clientId && referenceIdentifier && (
        <div className="mt-4 border-t border-t-gray-100 pt-4">
          <h3 className="text-md font-medium text-gray-600">
            {t("forms.rentalSummary.title", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </h3>
          <div className="pb-4 pt-2 text-sm text-gray-500">
            {t("forms.rentalSummary.message", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </div>
          <DefaultRentalSummary clientId={clientId} referenceType={referenceType} referenceId={referenceIdentifier} />
        </div>
      )}
    </CardLayout>
  );
};

export default SubmittedFormsSummaryDefaultLayout;
