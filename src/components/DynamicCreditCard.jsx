import React from "react";

import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

const DynamicCreditCard = ({
	number,
	name,
	cvc,
	expiryMonth,
	expiryYear,
	focused,
	setCardType,
	setCardMaxLength,
	locale,
	placeholders,
}) => {
	const expiry = `${expiryMonth}/${expiryYear}`;
	return (
		<Cards
			number={number}
			name={name}
			cvc={cvc}
			expiry={expiry}
			focused={focused}
			locale={locale}
			placeholders={placeholders}
			callback={(e) => {
				setCardType(e.issuer);
				setCardMaxLength(e.maxLength);
			}}
		/>
	);
};

export default DynamicCreditCard;
