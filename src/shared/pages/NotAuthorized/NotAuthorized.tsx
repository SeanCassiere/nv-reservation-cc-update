import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectConfigState } from "../../redux/store";

import CardLayout from "../../layouts/Card";
import AnchorLink from "../../components/Elements/AnchorLink";

const NotFoundImgUri = "/assets/undraw_page_not_found_su7k.svg";

const NotAuthorized: React.FC = () => {
  const config = useSelector(selectConfigState);
  const { t } = useTranslation();

  return (
    <CardLayout image={NotFoundImgUri} title={t("queryMissing.title")}>
      <p>{t("queryMissing.message")}</p>
      <p className="mt-2">
        {t("queryMissing.report")}&nbsp;
        <AnchorLink
          href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600"
        >
          {config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
        </AnchorLink>
      </p>
    </CardLayout>
  );
};

export default NotAuthorized;
