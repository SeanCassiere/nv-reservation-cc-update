import React, { ReactNode } from "react";
import Card from "react-bootstrap/esm/Card";
import { useSelector } from "react-redux";

import ErrorImg from "../../assets/undraw_warning_cyit.svg";
import { selectTranslations } from "../../redux/store";

const ErrorSubmission = ({ msg }: { msg: string | ReactNode }) => {
	const t = useSelector(selectTranslations);
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
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default ErrorSubmission;
