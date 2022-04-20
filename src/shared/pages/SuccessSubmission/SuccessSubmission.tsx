import React from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectTranslations } from "../../redux/store";

import SuccessImg from "../../assets/undraw_make_it_rain_iwk4.svg";
import { APP_CONSTANTS } from "../../utils/constants";

const SuccessSubmission = ({ referenceType }: { referenceType: string }) => {
	const t = useSelector(selectTranslations);
	return (
		<Card border='success' style={{ width: "100%", padding: "2rem 0.5rem" }}>
			<Card.Img variant='top' alt='Success' src={SuccessImg} />
			<Card.Body>
				<Card.Title>{t.success_submission.title}</Card.Title>
				<Card.Text>
					{t.success_submission.message}&nbsp;
					{referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT
						? t.reference_type.agreement
						: t.reference_type.reservation}
					.
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default SuccessSubmission;
