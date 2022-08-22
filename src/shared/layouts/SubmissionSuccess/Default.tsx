import React from "react";
import { Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import SuccessImg from "../../assets/undraw_make_it_rain_iwk4.svg";
import { selectConfigState } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";

const SubmissionSuccessDefaultLayout = () => {
  const { t } = useTranslation();
  const appConfig = useSelector(selectConfigState);

  return (
    <Card border="success" style={{ width: "100%", padding: "2rem 0.5rem" }}>
      <Card.Img variant="top" alt="Success" src={SuccessImg} />
      <Card.Body>
        <Card.Title>{t("successSubmission.title")}</Card.Title>
        <Card.Text>
          {t("successSubmission.message", {
            context: appConfig.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
          })}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SubmissionSuccessDefaultLayout;
