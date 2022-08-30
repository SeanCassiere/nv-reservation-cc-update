import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import Button from "../../components/Elements/Default/Button";
import DefaultRentalSummary from "../../components/RentalSummary/Default";

import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { APP_CONSTANTS } from "../../utils/constants";
import { useAppNavContext } from "../../hooks/logic/useAppNavContext";

interface IProps {}

const DefaultRentalSummaryController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext } = useAppNavContext();

  const clientId = useRuntimeStore((s) => s.clientId);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const referenceType = useRuntimeStore((s) => s.referenceType);

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
        <DefaultRentalSummary clientId={clientId ?? 0} referenceId={referenceId ?? 0} referenceType={referenceType} />
        <div className="mt-6 flex">
          {isPreviousAvailable && (
            <div className="pr-0">
              <Button color="primary" variant="muted" size="lg" onClick={goPrev}>
                {prevPageText}
              </Button>
            </div>
          )}
          <div className={isPreviousAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button color="primary" size="lg" onClick={goNext}>
              {nextPageText}
            </Button>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultRentalSummaryController;
