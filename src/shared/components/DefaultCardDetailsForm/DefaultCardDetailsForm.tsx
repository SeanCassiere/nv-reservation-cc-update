import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

import { ICreditCardFormData } from "../../redux/slices/forms";
import { selectTranslations } from "../../redux/store";
import { currentYearNum, range } from "../../utils/common";
import { YupErrorsFormatted } from "../../utils/yupSchemaErrors";

let numOfYears = range(currentYearNum, 58);
let numOfMonths = range(1, 12);

interface IProps {
	formData: ICreditCardFormData;
	cardMaxLength: number;
	schemaErrors: YupErrorsFormatted;
	handleBlur: () => void;
	handleFocus: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DefaultCardDetailsForm = ({
	formData,
	cardMaxLength,
	handleBlur,
	handleFocus,
	handleChange,
	schemaErrors,
}: IProps) => {
	const t = useSelector(selectTranslations);

	const isFieldInvalid = (field: string) => {
		const findIfAvailable = schemaErrors.find((error) => error.path === field);
		if (findIfAvailable) {
			return true;
		}
		return false;
	};

	return (
		<Form>
			<Row>
				<Col>
					<Form.Group controlId='numberInput'>
						<Form.Label>{t.form.labels.card_number}</Form.Label>
						<Form.Control
							placeholder='XXXX-XXXX-XXXX-XXXX'
							name='number'
							value={formData.number}
							onChange={handleChange}
							onFocus={handleFocus as any}
							onBlur={handleBlur}
							pattern={`[0-9]{${formData.type === "AMEX".toLowerCase() ? 13 : 15},${cardMaxLength + 1}}`}
							required
							type='text'
							maxLength={cardMaxLength + 1}
							autoComplete='off'
							isInvalid={isFieldInvalid("number")}
						/>
						<Form.Control.Feedback type='invalid'>{t.form.errors.card_number}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row className='mt-3'>
				<Col>
					<Form.Group controlId='nameInput'>
						<Form.Label>{t.form.labels.name_on_card}</Form.Label>
						<Form.Control
							placeholder={t.form.labels.p_holders.name}
							name='name'
							value={formData.name}
							onChange={handleChange}
							onFocus={handleFocus as any}
							onBlur={handleBlur}
							required
							type='text'
							autoComplete='off'
							isInvalid={isFieldInvalid("name")}
						/>
						<Form.Control.Feedback type='invalid'>{t.form.errors.name}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row className='mt-3'>
				<Col>
					<Form.Group controlId='monthInput'>
						<Form.Label>{t.form.labels.exp_month}</Form.Label>
						<Form.Control
							name='monthExpiry'
							onChange={handleChange}
							onFocus={handleFocus as any}
							onBlur={handleBlur}
							as='select'
							required
							isInvalid={isFieldInvalid("monthExpiry")}
						>
							<option value=''>{t.form.labels.p_holders.select}</option>
							{numOfMonths.map((val) => (
								<option value={val.toString().length === 1 ? `0${val}` : val} key={val}>
									{val.toString().length === 1 ? `0${val}` : val}
								</option>
							))}
						</Form.Control>
						<Form.Control.Feedback type='invalid'>{t.form.errors.exp_month}</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId='yearInput'>
						<Form.Label>{t.form.labels.exp_year}</Form.Label>
						<Form.Control
							name='yearExpiry'
							onChange={handleChange}
							onFocus={handleFocus as any}
							onBlur={handleBlur}
							as='select'
							required
							isInvalid={isFieldInvalid("yearExpiry")}
						>
							<option value=''>{t.form.labels.p_holders.select}</option>
							{numOfYears.map((val) => (
								<option value={val} key={val}>
									20{val}
								</option>
							))}
						</Form.Control>
						<Form.Control.Feedback type='invalid'>{t.form.errors.exp_year}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
			<Row>
				<Col>
					<Form.Group controlId='cvvInput'>
						<Form.Label>{t.form.labels.cvv}</Form.Label>
						<Form.Control
							placeholder='***'
							name='cvv'
							value={formData.cvv}
							onChange={handleChange}
							onFocus={handleFocus as any}
							onBlur={handleBlur}
							pattern={`[0-9]{3,4}`}
							required
							type='password'
							minLength={3}
							maxLength={4}
							isInvalid={isFieldInvalid("cvv")}
						/>
						<Form.Control.Feedback type='invalid'>{t.form.errors.cvv}</Form.Control.Feedback>
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId='zipCodeInput'>
						<Form.Label>{t.form.labels.billingZip}</Form.Label>
						<Form.Control
							placeholder={t.form.labels.p_holders.zip_code}
							name='billingZip'
							value={formData.billingZip}
							onChange={handleChange}
							required
							type='text'
							autoComplete='off'
							isInvalid={isFieldInvalid("billingZip")}
						/>
						<Form.Control.Feedback type='invalid'>{t.form.errors.billingZip}</Form.Control.Feedback>
					</Form.Group>
				</Col>
			</Row>
		</Form>
	);
};

export default DefaultCardDetailsForm;
