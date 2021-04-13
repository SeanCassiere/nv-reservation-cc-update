import React from "react";
import { Card } from "react-bootstrap";

import SuccessImg from "../assets/undraw_make_it_rain_iwk4.svg";

const SuccessSubmission = () => {
	return (
		<Card border='success' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Not Found' src={SuccessImg} />
			<Card.Body>
				<Card.Title>Success!</Card.Title>
				<Card.Text>
					<p>Thank you for submitting your credit card information towards your reservation.</p>
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default SuccessSubmission;
