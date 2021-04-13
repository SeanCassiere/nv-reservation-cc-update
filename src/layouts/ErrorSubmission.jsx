import React from "react";
import { Card } from "react-bootstrap";

import ErrorImg from "../assets/undraw_warning_cyit.svg";

const ErrorSubmission = () => {
	return (
		<Card border='danger' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Not Found' src={ErrorImg} />
			<Card.Body>
				<Card.Title>Uh-Oh</Card.Title>
				<Card.Text>
					<p>I encountered an error when trying to submit your information..</p>
					<p>
						Please report this issue to&nbsp;
						<a href='mailto:support@navotar.com' target='_blank' rel='noreferrer'>
							support@navotar.com
						</a>
					</p>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default ErrorSubmission;
