import React, { memo } from "react";
import Cards from "react-credit-cards";
import "react-credit-cards/es/styles-compiled.css";

import { useSelector } from "react-redux";
import { ICreditCardFormData } from "../../redux/slices/forms";
import { selectTranslations } from "../../redux/store";

interface IProps {
	currentFocus: string;
	formData: ICreditCardFormData;
	handleCardIdentifier: (type: string, maxLength: number) => void;
}

const DefaultCreditCard = ({ currentFocus, formData, handleCardIdentifier }: IProps) => {
	const t = useSelector(selectTranslations);
	const expiry = `${formData.monthExpiry}/${formData.yearExpiry}`;
	return (
		<Cards
			number={formData.number}
			name={formData.name}
			cvc={formData.cvv}
			expiry={expiry}
			locale={{ valid: t.form.credit_card.valid_thru }}
			placeholders={{ name: t.form.credit_card.your_name }}
			focused={currentFocus as any}
			callback={(card) => {
				handleCardIdentifier(card.issuer, card.maxLength);
			}}
		/>
	);
};

export default memo(DefaultCreditCard);
