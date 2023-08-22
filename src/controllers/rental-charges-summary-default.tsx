import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import RentalChargesSummaryList from "@/components/rental-charges-summary-list";
import { Button as UIButton } from "@/components/ui/button";

import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useClientProfileQuery } from "@/hooks/network/useClientProfile";
import { useRentalSummaryQuery } from "@/hooks/network/useRentalSummary";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { APP_CONSTANTS } from "@/utils/constants";

interface IProps {}

const DefaultRentalSummaryController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext } = useAppNavContext();

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
    <CardLayout
      title={t("forms.rentalSummary.title", {
        context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
      subtitle={t("forms.rentalSummary.message", {
        context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
    >
      <div className="mt-3">
        <RentalChargesSummaryList
          referenceType={referenceType}
          summary={rentalSummaryQuery.status === "success" ? rentalSummaryQuery.data : null}
          clientProfile={clientProfileQuery.status === "success" ? clientProfileQuery.data : null}
        />
        <div className="mt-6 flex">
          {isPreviousAvailable && (
            <div className="pr-0">
              <UIButton variant="outline" onClick={goPrev}>
                {prevPageText}
              </UIButton>
            </div>
          )}
          <div className={isPreviousAvailable ? "flex-1 pl-2" : "flex-1"}>
            <UIButton className="w-full" onClick={goNext}>
              {nextPageText}
            </UIButton>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultRentalSummaryController;
