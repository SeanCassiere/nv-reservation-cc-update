import React, { ReactNode, useMemo } from "react";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import { useSelector } from "react-redux";

import ErrorImg from "../../assets/undraw_warning_cyit.svg";
import { selectConfigState, selectRetrievedDetails, selectTranslations } from "../../redux/store";

interface Props {
	msg: string | ReactNode;
	tryAgainButton?: true | undefined;
}

const ErrorSubmission = ({ msg, tryAgainButton }: Props) => {
	const t = useSelector(selectTranslations);
	const config = useSelector(selectConfigState);
	const reservationData = useSelector(selectRetrievedDetails);

	const originUrl = useMemo(() => {
		const url = new URL(window.location.href);
		const returnUrl = `${url.origin}/?reservationId=${reservationData.reservationId}&lang=${config.lang}&config=${config.rawConfig}`;
		return returnUrl;
	}, [config.lang, config.rawConfig, reservationData.reservationId]);

	return (
		<Card border='danger' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Not Found' src={ErrorImg} />
			<Card.Body>
				<Card.Title>{t.bad_submission.title}</Card.Title>
				<Card.Text>
					{msg}
					<br />
					{t.bad_submission.report}&nbsp;
					<a href='mailto:support@navotar.com' target='_blank' rel='noreferrer'>
						support@navotar.com
					</a>
					.
					{tryAgainButton && (
						<>
							<br />
							<span className='mt-3 d-block'>
								<Button as='a' href={originUrl} size='lg' variant='outline-primary' style={{ width: "100%" }}>
									{t.bad_submission.retry_submission}
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