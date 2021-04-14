import React, { useState } from "react";
import { Card } from "react-bootstrap";

import translate from "../utils/translations.json";

import CreditCardDetailsForm from "../components/CreditCardDetailsForm";
import DynamicCreditCard from "../components/DynamicCreditCard";

const UserCreditCardController = ({ ccData, setCCData, handleSubmit, lang }) => {
	const [focus, setFocus] = useState("");
	const [cardMaxLength, setCardMaxLength] = useState(16);

	const handleChange = (e) => {
		setCCData({
			...ccData,
			[e.target.name]: e.target.value,
		});
	};

	const handleFocus = (e) => {
		if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
			setFocus("expiry");
		} else {
			setFocus(e.target.name);
		}
	};

	const handleBlur = () => setFocus("");

	const setCardType = (i) => {
		const e = { target: { name: "ccType", value: i } };
		handleChange(e);
	};

	return (
		<Card border='light' style={{ width: "100%" }}>
			<Card.Body>
				<Card.Title>{translate[lang].form.title}</Card.Title>
				<Card.Subtitle>{translate[lang].form.message}</Card.Subtitle>
				<div style={{ margin: "2rem -1.5rem" }}>
					<DynamicCreditCard
						cvc={ccData.cvc}
						expiryMonth={ccData.monthExpiry}
						expiryYear={ccData.yearExpiry}
						name={ccData.name}
						number={ccData.number}
						focused={focus}
						setCardType={setCardType}
						setCardMaxLength={setCardMaxLength}
						locale={{ valid: translate[lang].form.credit_card.valid_thru }}
						placeholders={{ name: translate[lang].form.credit_card.your_name }}
					/>
				</div>
				<div>
					<CreditCardDetailsForm
						handleFocus={handleFocus}
						handleSubmit={handleSubmit}
						handleChange={handleChange}
						handleBlur={handleBlur}
						ccData={ccData}
						cardMaxLength={cardMaxLength}
						lang={lang}
					/>
				</div>
			</Card.Body>
		</Card>
	);
};

export default UserCreditCardController;
