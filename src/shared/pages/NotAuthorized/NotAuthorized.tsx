import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectConfigState } from "../../redux/store";
import NotFoundImg from "../../assets/undraw_page_not_found_su7k.svg";

import CardLayout from "../../layouts/Card";

const NotAuthorized: React.FC = () => {
  const config = useSelector(selectConfigState);
  const { t } = useTranslation();

  return (
    <CardLayout image={NotFoundImg} title={t("queryMissing.title")}>
      <p>{t("queryMissing.message")}</p>
      <br />
      <p>{t("queryMissing.report")}</p>&nbsp;
      <a
        href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
        target="_blank"
        rel="noreferrer"
      >
        {config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
      </a>
    </CardLayout>
  );
};

export default NotAuthorized;
