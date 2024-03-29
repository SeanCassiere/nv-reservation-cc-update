import React, { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";

import AnchorLink from "@/components/anchor-link";
import CardLayout from "@/components/card-layout";

import { useConfigStore } from "@/hooks/stores/useConfigStore";

const ErrorImgUri = "/assets/undraw_warning_cyit.svg";

interface Props {
  title?: string;
  msg: string | ReactNode;
  tryAgainButton?: true | undefined;
  tryAgainButtonText?: string;
}

const ErrorSubmission: React.FC<Props> = (props) => {
  const { t } = useTranslation();

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
          href="mailto:support@rentallsoftware.com"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-primary underline"
        >
          {"support@rentallsoftware.com"}
        </AnchorLink>
        .
      </p>
      {props.tryAgainButton && props.tryAgainButtonText && (
        <span className="mt-3 block">
          <AnchorLink
            className="block w-full rounded bg-destructive px-3 py-3 text-center text-destructive-foreground no-underline hover:bg-destructive/90 hover:no-underline"
            href={originUrl}
          >
            {props.tryAgainButtonText}
          </AnchorLink>
        </span>
      )}
    </CardLayout>
  );
};

export default ErrorSubmission;
