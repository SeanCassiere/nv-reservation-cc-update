import React from "react";
import { useTranslation } from "react-i18next";

import FormSummaryItem from "./FormSummaryItem";

import type { DriversLicenseStoreType } from "../../hooks/stores/useFormStore";

type Props = {
  driverLicense: DriversLicenseStoreType["data"];
  editFunc: () => void;
};

const DriverLicense: React.FC<Props> = ({ driverLicense, editFunc }) => {
  const { t } = useTranslation();
  return (
    <FormSummaryItem title={t("forms.formsSummary.licenseUploadTitle")} onEdit={editFunc}>
      <div className="mt-2 py-2 px-3 rounded border border-gray-100 bg-gray-50 text-md text-gray-500 flex justify-center items-center">
        <img src={driverLicense.frontImageUrl!} className="object-contain md:max-w-xs" alt="" />
      </div>
      <div className="mt-2 py-2 px-3 rounded border border-gray-100 bg-gray-50 text-md text-gray-500 flex justify-center items-center">
        <img src={driverLicense.backImageUrl!} className="object-contain md:max-w-xs" alt="" />
      </div>
    </FormSummaryItem>
  );
};

export default DriverLicense;
