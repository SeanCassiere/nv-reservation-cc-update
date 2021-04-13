import React, { useState } from "react";
import { Card, Form, Row, Col, Button } from "react-bootstrap";

import DynamicCreditCard from "./DynamicCreditCard";

const currentYearNum = new Date().getFullYear().toString().substr(-2);

function range(start, end) {
	var ans = [];
	for (let i = start; i <= end; i++) {
		ans.push(i);
	}
	return ans;
}

let numsOfYears = range(currentYearNum, 58);
let numsOfMonths = range(1, 12);

const CreditCardForm = ({ ccData, handleChange, handleSubmit, lang, translate }) => {
	const [validated, setValidated] = useState(false);
	const [focus, setFocus] = useState("");
	const [cardMaxLength, setCardMaxLength] = useState(16);

	function handleFocus(e) {
		if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
			setFocus("expiry");
		} else {
			setFocus(e.target.name);
		}
	}

	function handleBlur() {
		setFocus("");
	}

	function setCardType(i) {
		const e = { target: { name: "ccType", value: i } };
		handleChange(e);
	}

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
		<>
			<Card border='light' style={{ width: "100%" }}>
				<Card.Body>
					<Card.Title>{translate[lang].form.title}</Card.Title>
					<Card.Subtitle>{translate[lang].form.message}</Card.Subtitle>
					<div style={{ margin: "2rem -1.5rem" }}>
						<DynamicCreditCard
							cvc={ccData.cvc}
							expiryMonth={ccData.monthExpiry}
							expiryYear={ccData.yearExpiry}
							name={ccData.name}
							number={ccData.number}
							focused={focus}
							setCardType={setCardType}
							setCardMaxLength={setCardMaxLength}
							locale={{ valid: translate[lang].form.credit_card.valid_thru }}
							placeholders={{ name: translate[lang].form.credit_card.your_name }}
						/>
					</div>
					<div>
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
										<Form.Control.Feedback type='invalid'>Enter a full credit card number.</Form.Control.Feedback>
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
										<Form.Control.Feedback type='invalid'>
											Enter the name printed on the credit card.
										</Form.Control.Feedback>
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
											{numsOfMonths.map((val) => (
												<option value={val.toString().length === 1 ? `0${val}` : val} key={val}>
													{val.toString().length === 1 ? `0${val}` : val}
												</option>
											))}
										</Form.Control>
										<Form.Control.Feedback type='invalid'>Enter the credit card expiry month.</Form.Control.Feedback>
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
											{numsOfYears.map((val) => (
												<option value={val} key={val}>
													20{val}
												</option>
											))}
										</Form.Control>
										<Form.Control.Feedback type='invalid'>Enter the credit card expiry year.</Form.Control.Feedback>
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
											required
											min={0}
											type='number'
											maxLength='4'
										/>
										<Form.Control.Feedback type='invalid'>
											Enter the PIN on the back of the credit card.
										</Form.Control.Feedback>
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
										<Form.Control.Feedback type='invalid'>Enter your billing zip code.</Form.Control.Feedback>
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
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

export default CreditCardForm;
