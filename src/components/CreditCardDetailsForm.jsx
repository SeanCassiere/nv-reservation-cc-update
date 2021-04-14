import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

import translate from "../utils/translations.json";

import { range, currentYearNum } from "../utils/functions";

let numOfYears = range(currentYearNum, 58);
let numOfMonths = range(1, 12);

const CreditCardDetailsForm = ({
	handleFocus,
	handleSubmit,
	handleChange,
	handleBlur,
	ccData,
	cardMaxLength,
	lang,
}) => {
	const [validated, setValidated] = useState(false);

	function handleLocalFormSubmit(e) {
		const form = e.currentTarget;
		if (form.checkValidity() === false) {
			e.preventDefault();
			e.stopPropagation();
		}
		setValidated(true);
		if (form.checkValidity() === true) {
			handleSubmit(e);
		}
	}

	return (
		<Form noValidate validated={validated} onSubmit={handleLocalFormSubmit}>
			<Row>
				<Col>
					<Form.Group controlId='numberInput'>
						<Form.Label>{translate[lang].form.labels.card_number}</Form.Label>
						<Form.Control
							placeholder='XXXX-XXXX-XXXX-XXXX'
							name='number'
							value={ccData.number}
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							pattern={`[0-9]{16,${cardMaxLength}}`}
							required
							type='text'
							maxLength={cardMaxLength}
						/>
						<Form.Control.Feedback type='invalid'>{translate[lang].form.errors.card_number}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group controlId='nameInput'>
						<Form.Label>{translate[lang].form.labels.name_on_card}</Form.Label>
						<Form.Control
							placeholder={translate[lang].form.labels.p_holders.name}
							name='name'
							value={ccData.name}
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							required
							type='text'
							autoComplete='off'
						/>
						<Form.Control.Feedback type='invalid'>{translate[lang].form.errors.name}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group controlId='monthInput'>
						<Form.Label>{translate[lang].form.labels.exp_month}</Form.Label>
						<Form.Control
							name='monthExpiry'
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							as='select'
							required
						>
							<option value=''>{translate[lang].form.labels.p_holders.select}</option>
							{numOfMonths.map((val) => (
								<option value={val.toString().length === 1 ? `0${val}` : val} key={val}>
									{val.toString().length === 1 ? `0${val}` : val}
								</option>
							))}
						</Form.Control>
						<Form.Control.Feedback type='invalid'>{translate[lang].form.errors.exp_month}</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId='yearInput'>
						<Form.Label>{translate[lang].form.labels.exp_year}</Form.Label>
						<Form.Control
							name='yearExpiry'
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							as='select'
							required
						>
							<option value=''>{translate[lang].form.labels.p_holders.select}</option>
							{numOfYears.map((val) => (
								<option value={val} key={val}>
									20{val}
								</option>
							))}
						</Form.Control>
						<Form.Control.Feedback type='invalid'>{translate[lang].form.errors.exp_year}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group controlId='cvvInput'>
						<Form.Label>{translate[lang].form.labels.cvv}</Form.Label>
						<Form.Control
							placeholder='***'
							name='cvc'
							value={ccData.cvc}
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							pattern={`[0-9]{3,4}`}
							required
							type='password'
							minLength='3'
							maxLength='4'
						/>
						<Form.Control.Feedback type='invalid'>{translate[lang].form.errors.cvv}</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId='zipCodeInput'>
						<Form.Label>{translate[lang].form.labels.billingZip}</Form.Label>
						<Form.Control
							placeholder={translate[lang].form.labels.p_holders.zip_code}
							name='billingZip'
							value={ccData.billingZip}
							onChange={handleChange}
							required
							type='text'
							autoComplete='off'
						/>
						<Form.Control.Feedback type='invalid'>{translate[lang].form.errors.billingZip}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Button variant='primary' type='submit' size='lg' block>
						{translate[lang].form.labels.submit}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export default CreditCardDetailsForm;
