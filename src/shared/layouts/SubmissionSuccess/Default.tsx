import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import SuccessImg from "../../assets/undraw_make_it_rain_iwk4.svg";
import { selectConfigState } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";

import CardLayout from "../Card";

const SubmissionSuccessDefaultLayout: React.FC = () => {
  const { t } = useTranslation();
  const appConfig = useSelector(selectConfigState);

  return (
    <CardLayout image={SuccessImg} title={t("successSubmission.title")}>
      <p>
        {t("successSubmission.message", {
          context: appConfig.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
      </p>
    </CardLayout>
  );
};

export default SubmissionSuccessDefaultLayout;
