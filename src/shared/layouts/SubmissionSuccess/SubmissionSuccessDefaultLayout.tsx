import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { selectConfigState } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";
import CardLayout from "../Card";

const SuccessImgUri = "/assets/undraw_make_it_rain_iwk4.svg";

const SubmissionSuccessDefaultLayout: React.FC = () => {
  const { t } = useTranslation();
  const appConfig = useSelector(selectConfigState);

  return (
    <CardLayout image={SuccessImgUri} title={t("successSubmission.title")}>
      <p className="mt-5 text-base">
        {t("successSubmission.message", {
          context: appConfig.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
      </p>
    </CardLayout>
  );
};

export default SubmissionSuccessDefaultLayout;
