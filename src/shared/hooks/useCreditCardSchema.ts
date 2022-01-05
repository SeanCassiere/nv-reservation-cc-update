import { useMemo } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import valid from "card-validator";

import { selectTranslations } from "../redux/store";

const useCreditCardSchema = () => {
	const t = useSelector(selectTranslations);

	const schema = useMemo(
		() =>
			yup.object().shape({
				name: yup.string().required(t.form.errors.name),
				type: yup.string().required(),
				number: yup
					.string()
					// .min(formValues.type.toLowerCase() === "AMEX".toLowerCase() ? 13 : 15, t.form.errors.card_number)
					.test("test-number", t.form.errors.card_number, (value) => valid.number(`${value}`).isValid)
					.required(t.form.errors.card_number),
				cvv: yup.string().required(t.form.errors.cvv),
				monthExpiry: yup
					.number()
					.test("test-number", t.form.errors.exp_month, (value) => valid.expirationMonth(`${value}`).isValid)
					.required(t.form.errors.exp_month),
				yearExpiry: yup
					.number()
					.test("test-number", t.form.errors.exp_year, (value) => valid.expirationYear(`${value}`).isValid)
					.required(t.form.errors.exp_year),
				billingZip: yup.string().required(t.form.errors.billingZip),
			}),
		[
			t.form.errors.billingZip,
			t.form.errors.card_number,
			t.form.errors.cvv,
			t.form.errors.exp_month,
			t.form.errors.exp_year,
			t.form.errors.name,
		]
	);

	return { schema };
};

export default useCreditCardSchema;
