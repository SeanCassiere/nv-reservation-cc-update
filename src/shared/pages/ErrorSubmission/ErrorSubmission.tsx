import React, { ReactNode, useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import ErrorImg from "../../assets/undraw_warning_cyit.svg";
import { selectConfigState, selectRetrievedDetails } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";

interface Props {
	msg: string | ReactNode;
	tryAgainButton?: true | undefined;
}

const ErrorSubmission = ({ msg, tryAgainButton }: Props) => {
	const { t } = useTranslation();

	const config = useSelector(selectConfigState);
	const reservationData = useSelector(selectRetrievedDetails);

	const originUrl = useMemo(() => {
		const url = new URL(window.location.href);
		const returnUrl = `${url.origin}/?${
			config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreementId" : "reservationId"
		}=${reservationData.referenceNo}&lang=${config.lang}&config=${config.rawConfig}`;
		return returnUrl;
	}, [config.lang, config.rawConfig, config.referenceType, reservationData.referenceNo]);

	return (
		<Card border='danger' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Not Found' src={ErrorImg} />
			<Card.Body>
				<Card.Title>{t("bad_submission.title")}</Card.Title>
				<Card.Text>
					{msg}
					<br />
					{t("bad_submission.report")}&nbsp;
					<a
						href={config.fromRentall ? "mailto:support@rentallsoftware.com" : "mailto:support@navotar.com"}
						target='_blank'
						rel='noreferrer'
					>
						{config.fromRentall ? "support@rentallsoftware.com" : "support@navotar.com"}
					</a>
					.
					{tryAgainButton && (
						<>
							<br />
							<span className='mt-3 d-block'>
								<Button as='a' href={originUrl} size='lg' variant='outline-primary' style={{ width: "100%" }}>
									{t("bad_submission.retry_submission")}
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
