import React, { useCallback, useState } from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

import { selectCreditCardForm } from "../../redux/store";
import { setCreditCardFormData } from "../../redux/slices/forms/slice";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import DefaultCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";
import { creditCardTypeFormat } from "../../utils/creditCardTypeFormat";

import useCreditCardSchema from "../../hooks/useCreditCardSchema";

interface IProps {
	handleSubmit: () => void;
	handlePrevious: () => void;
	isNextAvailable: boolean;
	isPrevPageAvailable: boolean;
}

const DefaultCreditCardController = ({
	handleSubmit,
	isNextAvailable,
	handlePrevious,
	isPrevPageAvailable,
}: IProps) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { data: initialFormData } = useSelector(selectCreditCardForm);

	const [formValues, setFormValues] = useState(initialFormData);
	const [schemaErrors, setSchemaErrors] = useState<YupErrorsFormatted>([]);
	const [cardMaxLength, setCardMaxLength] = useState(16);

	const [currentFocus, setCurrentFocus] = useState<string>("");

	const { schema } = useCreditCardSchema();

	// validate the form data against the schema
	const handleNextState = useCallback(async () => {
		try {
			await schema.validate(formValues, { abortEarly: false });
			dispatch(setCreditCardFormData(formValues));
			handleSubmit();
		} catch (error: any) {
			const err = error as yup.ValidationError;
			const formErrors = yupFormatSchemaErrors(err);
			if (process.env.NODE_ENV !== "production") console.log(formErrors);
			setSchemaErrors(formErrors);
		}
	}, [dispatch, formValues, handleSubmit, schema]);

	// Form element handlers
	const handleCardIdentifier = useCallback(
		(type: string, maxLength: number) => {
			const formattedType = creditCardTypeFormat(type);
			setFormValues({
				...formValues,
				type: formattedType,
			});
			setCardMaxLength(maxLength);
		},
		[formValues]
	);
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setFormValues({
				...formValues,
				[e.target.name]: e.target.value,
			});
		},
		[formValues]
	);
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

	return (
		<Card border='light'>
			<Card.Body>
				<Card.Title>{t("forms.creditCard.title")}</Card.Title>
				<Card.Subtitle>{t("forms.creditCard.message")}</Card.Subtitle>
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
						{isPrevPageAvailable && (
							<Col xs={2} className='pr-0'>
								<Button variant='warning' size='lg' style={{ width: "100%" }} onClick={handlePrevious}>
									&#8592;
								</Button>
							</Col>
						)}
						<Col xs={isPrevPageAvailable ? 10 : 12} className={isPrevPageAvailable ? "pl-2" : ""}>
							<Button variant='primary' size='lg' style={{ width: "100%" }} onClick={handleNextState}>
								{isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
							</Button>
						</Col>
					</Row>
				</div>
			</Card.Body>
		</Card>
	);
};

export default DefaultCreditCardController;
