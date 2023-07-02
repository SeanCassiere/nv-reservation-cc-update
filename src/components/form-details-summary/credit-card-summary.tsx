import React from "react";
import { useTranslation } from "react-i18next";

import FormSummaryItem from "./form-summary-item";

import { CreditCardIcon, MapIcon, PersonIcon } from "@/components/Icons";
import type { CreditCardStoreType } from "@/hooks/stores/useFormStore";

type Props = {
  creditCard: CreditCardStoreType["data"];
  editFunc?: () => void;
};

const CreditCardSummary: React.FC<Props> = ({ editFunc, creditCard }) => {
  const { t } = useTranslation();
  const [showCvv, setShowCvv] = React.useState(false);
  return (
    <FormSummaryItem title={t("forms.formsSummary.creditCardTitle")} onEdit={editFunc}>
      <div className="text-md mt-2 grid grid-cols-6 gap-2 rounded border border-muted bg-foreground/5 px-3 py-2 text-primary/80">
        <div className="col-span-4 flex flex-row items-center gap-2 md:col-span-4">
          <span>
            <CreditCardIcon />
          </span>
          <span>{creditCard.number}</span>
        </div>
        <div className="col-span-2 grid grid-cols-2 pl-1 md:col-span-2 md:pl-0">
          <span>{creditCard.monthYearExpiry}</span>
          <button className="ml-1 md:ml-0" onClick={() => setShowCvv((prev) => !prev)}>
            {showCvv ? (
              creditCard.cvv
            ) : (
              <>
                {creditCard.cvv.split("").map((_, idx) => (
                  <span key={`cc-star-${idx}`} className="font-normal">
                    *
                  </span>
                ))}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="text-md mt-2 grid grid-cols-6 gap-2 rounded border border-muted bg-foreground/5 px-3 py-2 text-primary/80">
        <div className="col-span-6 md:col-span-4">
          <div className="col-span-4 flex flex-row items-center gap-2">
            <span>
              <PersonIcon />
            </span>
            <span>{creditCard.name}</span>
          </div>
        </div>
        <div className="col-span-6 md:col-span-2">
          <div className="col-span-4 flex flex-row items-center gap-2">
            <span>
              <MapIcon />
            </span>
            <span>{creditCard.billingZip}</span>
          </div>
        </div>
      </div>
    </FormSummaryItem>
  );
};

export default CreditCardSummary;
