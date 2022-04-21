import React, { memo } from "react";
import Cards from "react-credit-cards";
import { useTranslation } from "react-i18next";
import "react-credit-cards/es/styles-compiled.css";

import { ICreditCardFormData } from "../../redux/slices/forms/slice";

interface IProps {
	currentFocus: string;
	formData: ICreditCardFormData;
	handleCardIdentifier: (type: string, maxLength: number) => void;
}

const DefaultCreditCard = ({ currentFocus, formData, handleCardIdentifier }: IProps) => {
	const { t } = useTranslation();
	const expiry = `${formData.monthExpiry}/${formData.yearExpiry}`;
	return (
		<Cards
			number={formData.number}
			name={formData.name}
			cvc={formData.cvv}
			expiry={expiry}
			locale={{ valid: t("form.credit_card.valid_thru") }}
			placeholders={{ name: t("form.credit_card.your_name") }}
			focused={currentFocus as any}
			callback={(card) => {
				handleCardIdentifier(card.issuer, card.maxLength);
			}}
		/>
	);
};

export default memo(DefaultCreditCard);
