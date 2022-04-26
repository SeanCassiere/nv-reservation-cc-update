import { useMemo } from "react";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import valid from "card-validator";

const useCreditCardSchema = () => {
	const { t } = useTranslation();

	const schema = useMemo(
		() =>
			yup.object().shape({
				name: yup.string().required(t("forms.credit_card.errors.name")),
				type: yup.string().required(),
				number: yup
					.string()
					// .min(formValues.type.toLowerCase() === "AMEX".toLowerCase() ? 13 : 15, t("forms.credit_card.errors.card_number"))
					.test("test-number", t("forms.credit_card.errors.card_number"), (value) => valid.number(`${value}`).isValid)
					.required(t("forms.credit_card.errors.card_number")),
				cvv: yup.string().required(t("forms.credit_card.errors.cvv")),
				monthExpiry: yup
					.number()
					.test(
						"test-number",
						t("forms.credit_card.errors.exp_month"),
						(value) => valid.expirationMonth(`${value}`).isValid
					)
					.required(t("forms.credit_card.errors.exp_month")),
				yearExpiry: yup
					.number()
					.test(
						"test-number",
						t("forms.credit_card.errors.exp_year"),
						(value) => valid.expirationYear(`${value}`).isValid
					)
					.required(t("forms.credit_card.errors.exp_year")),
				billingZip: yup.string().required(t("forms.credit_card.errors.billingZip")),
			}),
		[t]
	);

	return { schema };
};

export default useCreditCardSchema;
