import React, { useCallback, useState } from "react";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { selectCreditCardForm, selectTranslations } from "../../redux/store";
import DefaultCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import { setCreditCardFormData } from "../../redux/slices/forms";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";

interface IProps {
	handleSubmit: () => void;
	isNextAvailable: () => boolean;
	handlePrevious: () => void;
	isPrevPageAvailable: () => boolean;
}

const DefaultCreditCardController = ({
	handleSubmit,
	isNextAvailable,
	handlePrevious,
	isPrevPageAvailable,
}: IProps) => {
	const dispatch = useDispatch();
	const t = useSelector(selectTranslations);
	const { data: initialFormData } = useSelector(selectCreditCardForm);

	const [formValues, setFormValues] = useState(initialFormData);
	const [schemaErrors, setSchemaErrors] = useState<YupErrorsFormatted>([]);
	const [cardMaxLength, setCardMaxLength] = useState(16);

	const [currentFocus, setCurrentFocus] = useState<string>("");

	const schema = yup.object().shape({
		name: yup.string().required(t.form.errors.name),
		type: yup.string().required(),
		number: yup
			.string()
			.min(formValues.type.toLowerCase() === "AMEX".toLowerCase() ? 13 : 15, t.form.errors.card_number)
			.required(t.form.errors.card_number),
		cvv: yup.string().required(t.form.errors.cvv),
		monthExpiry: yup.number().required(t.form.errors.exp_month),
		yearExpiry: yup.number().required(t.form.errors.exp_year),
		billingZip: yup.string().required(t.form.errors.billingZip),
	});

	const handleNextState = async () => {
		try {
			await schema.validate(formValues, { abortEarly: false });
			dispatch(setCreditCardFormData(formValues));
			handleSubmit();
		} catch (error: any) {
			const err = error as yup.ValidationError;
			const formErrors = yupFormatSchemaErrors(err);
			console.log(formErrors);
			setSchemaErrors(formErrors);
		}
	};

	const handleCardIdentifier = useCallback(
		(type: string, maxLength: number) => {
			setFormValues({
				...formValues,
				type,
			});
			setCardMaxLength(maxLength);
		},
		[formValues]
	);
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormValues({
			...formValues,
			[e.target.name]: e.target.value,
		});
	};
	const handleFocus = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
			setCurrentFocus("expiry");
		} else if (e.target.name === "cvv") {
			setCurrentFocus("cvc");
		} else {
			setCurrentFocus(e.target.name);
		}
	}, []);
	const handleBlur = useCallback(() => setCurrentFocus(""), []);

	console.log("prevPageAvailable", isPrevPageAvailable());

	return (
		<Card border='light'>
			<Card.Body>
				<Card.Title>{t.form.title}</Card.Title>
				<Card.Subtitle>{t.form.message}</Card.Subtitle>
				<div className='mt-4 d-grid'>
					<Row>
						<Col md={12}>
							<DefaultCreditCard
								currentFocus={currentFocus}
								formData={formValues}
								handleCardIdentifier={handleCardIdentifier}
							/>
						</Col>
					</Row>
					<Row className='mt-3'>
						<Col md={12}>
							<DefaultCardDetailsForm
								formData={formValues}
								cardMaxLength={cardMaxLength}
								handleChange={handleChange}
								handleBlur={handleBlur}
								handleFocus={handleFocus}
								schemaErrors={schemaErrors}
							/>
						</Col>
					</Row>
					<Row className='mt-3'>
						{isPrevPageAvailable() && (
							<Col xs={2} className='pr-0'>
								<Button variant='warning' size='lg' style={{ width: "100%" }} onClick={handlePrevious}>
									&#8592;
								</Button>
							</Col>
						)}
						<Col xs={isPrevPageAvailable() ? 10 : 12} className={isPrevPageAvailable() ? "pl-2" : ""}>
							<Button variant='primary' size='lg' style={{ width: "100%" }} onClick={handleNextState}>
								{isNextAvailable() ? t.form.labels.next : t.form.labels.submit}
							</Button>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);
};

export default DefaultCreditCardController;
