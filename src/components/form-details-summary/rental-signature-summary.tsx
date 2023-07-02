import React from "react";
import { useTranslation } from "react-i18next";

import FormSummaryItem from "./form-summary-item";

import type { RentalSignatureStoreType } from "@/hooks/stores/useFormStore";

type Props = {
  rentalSignature: RentalSignatureStoreType["data"];
  editFunc?: () => void;
};

const RentalSignature: React.FC<Props> = ({ rentalSignature, editFunc }) => {
  const { t } = useTranslation();
  return (
    <FormSummaryItem title={t("forms.formsSummary.rentalSignatureTitle")} onEdit={editFunc}>
      <div className="text-md mt-2 flex items-center justify-center rounded border border-muted bg-white/75 px-3 py-2 text-primary/80">
        {rentalSignature.signatureUrl && (
          <img src={rentalSignature.signatureUrl} className="object-contain md:max-w-xs" alt="" />
        )}
      </div>
    </FormSummaryItem>
  );
};

export default RentalSignature;
