import React from "react";

import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

const DynamicCreditCard = ({ number, name, cvc, expiryMonth, expiryYear, focused, setCardType, setCardMaxLength }) => {
	const expiry = `${expiryMonth}/${expiryYear}`;
	return (
		<Cards
			number={number}
			name={name}
			cvc={cvc}
			expiry={expiry}
			focused={focused}
			callback={(e) => {
				setCardType(e.issuer);
				setCardMaxLength(e.maxLength);
			}}
			size='200px'
		/>
	);
};

export default DynamicCreditCard;
