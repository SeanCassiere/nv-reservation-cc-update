import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import DefaultRentalSummary from "@/components/RentalSummary/Default";

import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { APP_CONSTANTS, SuccessImgUri } from "@/utils/constants";

const RentalChargesSummarySuccessDefaultLayout: React.FC = () => {
  const { t } = useTranslation();

  const clientId = useRuntimeStore((s) => s.clientId);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const referenceType = useRuntimeStore((s) => s.referenceType);

  return (
    <CardLayout image={SuccessImgUri} title={t("successSubmission.title")}>
      <p className="mt-5 text-base">
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

export default RentalChargesSummarySuccessDefaultLayout;
