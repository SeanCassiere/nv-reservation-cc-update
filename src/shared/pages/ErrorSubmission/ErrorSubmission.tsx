import React, { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ErrorImg from "../../assets/undraw_warning_cyit.svg";
import { selectConfigState } from "../../redux/store";

import CardLayout from "../../layouts/Card";

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
    <CardLayout image={ErrorImg} title={props.title ? props.title : t("badSubmission.title")}>
      <p>{props.msg}</p>
      <br />
      <p>
        {t("badSubmission.report")}&nbsp;
        <a
          href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
          target="_blank"
          rel="noreferrer"
        >
          {config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
        </a>
        .
      </p>
      {props.tryAgainButton && (
        <>
          <br />
          <span className="mt-3 block">
            <a
              className="block rounded no-underline hover:no-underline text-center w-full px-3 py-3 bg-red-600 hover:bg-red-700 text-white"
              href={originUrl}
            >
              {t("badSubmission.btnRetrySubmission")}
            </a>
          </span>
        </>
      )}
    </CardLayout>
  );
};

export default ErrorSubmission;
