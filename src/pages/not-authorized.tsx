import React from "react";
import { useTranslation } from "react-i18next";

import AnchorLink from "@/components/anchor-link";
import CardLayout from "@/components/card-layout";

const NotFoundImgUri = "/assets/undraw_page_not_found_su7k.svg";

const NotAuthorized: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CardLayout image={NotFoundImgUri} title={t("queryMissing.title")}>
      <p>{t("queryMissing.message")}</p>
      <p className="mt-2">
        {t("queryMissing.report")}&nbsp;
        <AnchorLink
          href="mailto:support@rentallsoftware.com"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-primary underline"
        >
          {"support@rentallsoftware.com"}
        </AnchorLink>
      </p>
    </CardLayout>
  );
};

export default NotAuthorized;
