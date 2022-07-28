import React, { ReactNode, useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ErrorImg from "../../assets/undraw_warning_cyit.svg";
import { selectConfigState } from "../../redux/store";

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
    <Card border="danger" style={{ width: "100%", padding: "2rem 0.5rem" }}>
      <Card.Img variant="top" alt="Not Found" src={ErrorImg} />
      <Card.Body>
        <Card.Title>{props.title ? props.title : t("badSubmission.title")}</Card.Title>
        <Card.Text>
          {props.msg}
          <br />
          {t("badSubmission.report")}&nbsp;
          <a
            href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
            target="_blank"
            rel="noreferrer"
          >
            {config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
          </a>
          .
          {props.tryAgainButton && (
            <>
              <br />
              <span className="mt-3 d-block">
                <Button as="a" href={originUrl} size="lg" variant="outline-primary" style={{ width: "100%" }}>
                  {t("badSubmission.btnRetrySubmission")}
                </Button>
              </span>
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ErrorSubmission;
