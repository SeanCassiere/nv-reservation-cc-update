import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectTranslations } from "../../redux/store";

import SuccessImg from "../../assets/undraw_make_it_rain_iwk4.svg";

const SuccessSubmission = ({ referenceType }: { referenceType: "Reservation" | "Agreement" }) => {
	const t = useSelector(selectTranslations);
	return (
		<Card border='success' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Success' src={SuccessImg} />
			<Card.Body>
				<Card.Title>{t.success_submission.title}</Card.Title>
				<Card.Text>
					{t.success_submission.message}&nbsp;
					{referenceType === "Agreement" ? t.reference_type.agreement : t.reference_type.reservation}.
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default SuccessSubmission;
