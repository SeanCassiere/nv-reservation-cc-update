import React, { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectConfigState } from "../../redux/store";

import CardLayout from "../../layouts/Card";
import AnchorLink from "../../components/Elements/AnchorLink";

const ErrorImgUri = "/assets/undraw_warning_cyit.svg";

interface Props {
  title?: string;
  msg: string | ReactNode;
  tryAgainButton?: true | undefined;
}

const ErrorSubmission: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const config = useSelector(selectConfigState);

  const originUrl = useMemo(() => {
    const url = new URL(window.location.href);
    const returnUrl = `${url.origin}/${config.rawQueryString}`;
    return returnUrl;
  }, [config.rawQueryString]);

  return (
    <CardLayout image={ErrorImgUri} title={props.title ? props.title : t("badSubmission.title")}>
      <p>{props.msg}</p>
      <p className="mt-2">
        {t("badSubmission.report")}&nbsp;
        <AnchorLink
          href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600"
        >
          {config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
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
