import React from "react";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import valid from "card-validator";

const useCreditCardSchema = () => {
	const { t } = useTranslation();

	const schema = React.useMemo(
		() =>
			yup.object().shape({
				name: yup.string().required(t("forms.creditCard.errors.name")),
				type: yup.string().required(),
				number: yup
					.string()
					// .min(formValues.type.toLowerCase() === "AMEX".toLowerCase() ? 13 : 15, t("forms.creditCard.errors.card_number"))
					.test("test-number", t("forms.creditCard.errors.cardNumber"), (value) => valid.number(`${value}`).isValid)
					.required(t("forms.creditCard.errors.cardNumber")),
				cvv: yup.string().required(t("forms.creditCard.errors.cvv")),
				monthExpiry: yup
					.number()
					.test(
						"test-number",
						t("forms.creditCard.errors.expMonth"),
						(value) => valid.expirationMonth(`${value}`).isValid
					)
					.required(t("forms.creditCard.errors.expMonth")),
				yearExpiry: yup
					.number()
					.test(
						"test-number",
						t("forms.creditCard.errors.expYear"),
						(value) => valid.expirationYear(`${value}`).isValid
					)
					.required(t("forms.creditCard.errors.expYear")),
				billingZip: yup.string().required(t("forms.creditCard.errors.billingZip")),
			}),
		[t]
	);

	return { schema };
};

export default useCreditCardSchema;
