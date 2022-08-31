import React from "react";
import { useTranslation } from "react-i18next";

import FormSummaryItem from "./FormSummaryItem";

import type { RentalSignatureStoreType } from "../../hooks/stores/useFormStore";

type Props = {
  rentalSignature: RentalSignatureStoreType["data"];
  editFunc: () => void;
};

const RentalSignature: React.FC<Props> = ({ rentalSignature, editFunc }) => {
  const { t } = useTranslation();
  return (
    <FormSummaryItem title={t("forms.formsSummary.rentalSignatureTitle")} onEdit={editFunc}>
      <div className="mt-2 py-2 px-3 rounded border border-gray-100 bg-gray-50 text-md text-gray-500 flex justify-center items-center">
        <img src={rentalSignature.signatureUrl!} className="object-contain md:max-w-xs" alt="" />
      </div>
    </FormSummaryItem>
  );
};

export default RentalSignature;
