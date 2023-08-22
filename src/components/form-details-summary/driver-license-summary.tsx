import React from "react";
import { useTranslation } from "react-i18next";

import type { DriversLicenseStoreType } from "@/hooks/stores/useFormStore";

import FormSummaryItem from "./form-summary-item";

type Props = {
  driverLicense: DriversLicenseStoreType["data"];
  editFunc?: () => void;
};

const DriverLicense: React.FC<Props> = ({ driverLicense, editFunc }) => {
  const { t } = useTranslation();
  return (
    <FormSummaryItem title={t("forms.formsSummary.licenseUploadTitle")} onEdit={editFunc}>
      <div className="text-md mt-2 flex items-center justify-center rounded border border-muted bg-foreground/5 px-3 py-2 text-primary/80">
        {driverLicense.frontImageUrl && (
          <img src={driverLicense.frontImageUrl} className="object-contain md:max-w-xs" alt="" />
        )}
      </div>
      <div className="text-md mt-2 flex items-center justify-center rounded border border-muted bg-foreground/5 px-3 py-2 text-primary/80">
        {driverLicense.backImageUrl && (
          <img src={driverLicense.backImageUrl} className="object-contain md:max-w-xs" alt="" />
        )}
      </div>
    </FormSummaryItem>
  );
};

export default DriverLicense;
