import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import RentalChargesSummaryList from "@/components/rental-charges-summary-list";

import { useClientProfileQuery } from "@/hooks/network/useClientProfile";
import { useRentalSummaryQuery } from "@/hooks/network/useRentalSummary";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { APP_CONSTANTS, SuccessImgUri } from "@/utils/constants";

const RentalChargesSummarySuccessDefaultLayout: React.FC = () => {
  const { t } = useTranslation();

  const clientId = useRuntimeStore((s) => s.clientId);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const referenceType = useRuntimeStore((s) => s.referenceType);

  const rentalSummaryQuery = useRentalSummaryQuery({
    clientId: String(clientId),
    referenceId: String(referenceId),
    referenceType,
  });

  const clientProfileQuery = useClientProfileQuery({ clientId: String(clientId) });

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
        <RentalChargesSummaryList
          referenceType={referenceType}
          summary={rentalSummaryQuery.status === "success" ? rentalSummaryQuery.data : null}
          clientProfile={clientProfileQuery.status === "success" ? clientProfileQuery.data : null}
        />
      </div>
    </CardLayout>
  );
};

export default RentalChargesSummarySuccessDefaultLayout;
