import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../Card";
import DefaultRentalSummary from "../../components/RentalSummary/DefaultRentalSummary";

import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { APP_CONSTANTS } from "../../utils/constants";

const RentalSummarySuccessDefaultLayout: React.FC = () => {
  const { t } = useTranslation();

  const clientId = useRuntimeStore((s) => s.clientId);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const referenceType = useRuntimeStore((s) => s.referenceType);

  return (
    <CardLayout title={t("successSubmission.title")}>
      <p className="mt-5 text-base text-justify">
        {t("successSubmission.message", {
          context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
        &nbsp;
        {t("successSubmission.rentalSummaryMessage", {
          context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
      </p>
      <div className="mt-5">
        <DefaultRentalSummary clientId={clientId ?? 0} referenceId={referenceId ?? 0} referenceType={referenceType} />
      </div>
    </CardLayout>
  );
};

export default RentalSummarySuccessDefaultLayout;
