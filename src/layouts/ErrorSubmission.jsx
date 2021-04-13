import React from "react";
import { Card } from "react-bootstrap";

import ErrorImg from "../assets/undraw_warning_cyit.svg";

const ErrorSubmission = ({ lang, translate }) => {
	return (
		<Card border='danger' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Not Found' src={ErrorImg} />
			<Card.Body>
				<Card.Title>{translate[lang].bad_submission.title}</Card.Title>
				<Card.Text>
					{translate[lang].bad_submission.message}
					<br />
					{translate[lang].bad_submission.report}&nbsp;
					<a href='mailto:support@navotar.com' target='_blank' rel='noreferrer'>
						support@navotar.com
					</a>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default ErrorSubmission;
