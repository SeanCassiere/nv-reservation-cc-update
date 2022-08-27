import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import AnchorLink from "../../components/Elements/AnchorLink";

import { useConfigStore } from "../../hooks/stores/useConfigStore";

const NotFoundImgUri = "/assets/undraw_page_not_found_su7k.svg";

const NotAuthorized: React.FC = () => {
  const { t } = useTranslation();

  const isUsingRentall = useConfigStore((s) => s.fromRentall);

  return (
    <CardLayout image={NotFoundImgUri} title={t("queryMissing.title")}>
      <p>{t("queryMissing.message")}</p>
      <p className="mt-2">
        {t("queryMissing.report")}&nbsp;
        <AnchorLink
          href={isUsingRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600"
        >
          {isUsingRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
        </AnchorLink>
      </p>
    </CardLayout>
  );
};

export default NotAuthorized;
