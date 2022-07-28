import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectConfigState } from "../../redux/store";
import NotFoundImg from "../../assets/undraw_page_not_found_su7k.svg";

const NotAuthorized: React.FC = () => {
  const config = useSelector(selectConfigState);
  const { t } = useTranslation();

  return (
    <Card border="light" style={{ width: "100%", padding: "2rem 1rem" }}>
      <Card.Img variant="top" alt="Not Found" src={NotFoundImg} />
      <Card.Body>
        <Card.Title>{t("queryMissing.title")}</Card.Title>
        <Card.Text>
          {t("queryMissing.message")}
          <br />
          {t("queryMissing.report")}&nbsp;
          <a
            href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
            target="_blank"
            rel="noreferrer"
          >
            {config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
          </a>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default NotAuthorized;
