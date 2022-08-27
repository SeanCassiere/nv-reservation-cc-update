import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../Card";

import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { APP_CONSTANTS } from "../../utils/constants";

const SuccessImgUri = "/assets/undraw_make_it_rain_iwk4.svg";

const SubmissionSuccessDefaultLayout: React.FC = () => {
  const { t } = useTranslation();

  const referenceType = useRuntimeStore((s) => s.referenceType);

  return (
    <CardLayout image={SuccessImgUri} title={t("successSubmission.title")}>
      <p className="mt-5 text-base">
        {t("successSubmission.message", {
          context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
      </p>
    </CardLayout>
  );
};

export default SubmissionSuccessDefaultLayout;
