import React from "react";
import { useTranslation } from "react-i18next";

import FormSummaryItem from "./form-summary-item";

import type { DriversLicenseStoreType } from "@/hooks/stores/useFormStore";

type Props = {
  driverLicense: DriversLicenseStoreType["data"];
  editFunc?: () => void;
};

const DriverLicense: React.FC<Props> = ({ driverLicense, editFunc }) => {
  const { t } = useTranslation();
  return (
    <FormSummaryItem title={t("forms.formsSummary.licenseUploadTitle")} onEdit={editFunc}>
      <div className="text-md mt-2 flex items-center justify-center rounded border border-gray-100 bg-gray-50 px-3 py-2 text-gray-500">
        {driverLicense.frontImageUrl && (
          <img src={driverLicense.frontImageUrl} className="object-contain md:max-w-xs" alt="" />
        )}
      </div>
      <div className="text-md mt-2 flex items-center justify-center rounded border border-gray-100 bg-gray-50 px-3 py-2 text-gray-500">
        {driverLicense.backImageUrl && (
          <img src={driverLicense.backImageUrl} className="object-contain md:max-w-xs" alt="" />
        )}
      </div>
    </FormSummaryItem>
  );
};

export default DriverLicense;
