import React, { useEffect } from "react";
import { Card } from "react-bootstrap";

import translate from "../utils/translations.json";

import SuccessImg from "../assets/undraw_make_it_rain_iwk4.svg";

const SuccessSubmission = ({ lang }) => {
	useEffect(() => {
		window.history.pushState({}, "Successfully submitted Credit Card information", "/success");
	}, []);

	return (
		<Card border='success' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Success' src={SuccessImg} />
			<Card.Body>
				<Card.Title>{translate[lang].success_submission.title}</Card.Title>
				<Card.Text>{translate[lang].success_submission.message}</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default SuccessSubmission;
