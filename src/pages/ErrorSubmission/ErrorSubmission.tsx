import React, { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import AnchorLink from "../../components/Elements/AnchorLink";

import { useConfigStore } from "../../hooks/stores/useConfigStore";

const ErrorImgUri = "/assets/undraw_warning_cyit.svg";

interface Props {
  title?: string;
  msg: string | ReactNode;
  tryAgainButton?: true | undefined;
}

const ErrorSubmission: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const isUsingRentall = useConfigStore((s) => s.fromRentall);
  const rawInitUrlQueryString = useConfigStore((s) => s.rawQueryString);

  const originUrl = useMemo(() => {
    const url = new URL(window.location.href);
    const returnUrl = `${url.origin}/${rawInitUrlQueryString}`;
    return returnUrl;
  }, [rawInitUrlQueryString]);

  return (
    <CardLayout image={ErrorImgUri} title={props.title ? props.title : t("badSubmission.title")}>
      <p>{props.msg}</p>
      <p className="mt-2">
        {t("badSubmission.report")}&nbsp;
        <AnchorLink
          href={isUsingRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600"
        >
          {isUsingRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
        </AnchorLink>
        .
      </p>
      {props.tryAgainButton && (
        <>
          <span className="mt-3 block">
            <AnchorLink
              className="block rounded no-underline hover:no-underline text-center w-full px-3 py-3 bg-red-600 hover:bg-red-700 text-white"
              href={originUrl}
            >
              {t("badSubmission.btnRetrySubmission")}
            </AnchorLink>
          </span>
        </>
      )}
    </CardLayout>
  );
};

export default ErrorSubmission;
