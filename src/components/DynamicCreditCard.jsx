import React from "react";

import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

const DynamicCreditCard = ({ number, name, cvc, expiryMonth, expiryYear, focused }) => {
	const expiry = `${expiryMonth}/${expiryYear}`;
	return (
		<div>
			<div>
				<Cards number={number} name={name} cvc={cvc} expiry={expiry} focused={focused} />
			</div>
		</div>
	);
};

export default DynamicCreditCard;
