import React, { memo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { ICreditCardFormData } from "../../redux/slices/forms/slice";
import { currentYearNum, range } from "../../utils/common";
import { YupErrorsFormatted } from "../../utils/yupSchemaErrors";

let numOfYears = range(currentYearNum, 40);
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
  const { t } = useTranslation();

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
          <Form.Group controlId="numberInput">
            <Form.Label>{t("forms.creditCard.labels.cardNumber")}</Form.Label>
            <Form.Control
              placeholder="XXXX-XXXX-XXXX-XXXX"
              name="number"
              value={formData.number}
              onChange={handleChange}
              onFocus={handleFocus as any}
              onBlur={handleBlur}
              pattern={`[0-9]{${formData.type === "AMEX".toLowerCase() ? 13 : 15},${cardMaxLength + 1}}`}
              required
              type="text"
              maxLength={cardMaxLength + 1}
              autoComplete="off"
              isInvalid={isFieldInvalid("number")}
            />
            <Form.Control.Feedback type="invalid">{t("forms.creditCard.errors.cardNumber")}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="nameInput">
            <Form.Label>{t("forms.creditCard.labels.nameOnCard")}</Form.Label>
            <Form.Control
              placeholder={t("forms.creditCard.labels.placeholders.name")}
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFocus as any}
              onBlur={handleBlur}
              required
              type="text"
              autoComplete="off"
              isInvalid={isFieldInvalid("name")}
            />
            <Form.Control.Feedback type="invalid">{t("forms.creditCard.errors.name")}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="monthInput">
            <Form.Label>{t("forms.creditCard.labels.expMonth")}</Form.Label>
            <Form.Select
              name="monthExpiry"
              onChange={handleChange as any}
              onFocus={handleFocus as any}
              onBlur={handleBlur}
              required
              isInvalid={isFieldInvalid("monthExpiry")}
              className="form-control"
            >
              <option value="">{t("forms.creditCard.labels.placeholders.select")}</option>
              {numOfMonths.map((val) => (
                <option value={val.toString().length === 1 ? `0${val}` : val} key={val}>
                  {val.toString().length === 1 ? `0${val}` : val}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{t("forms.creditCard.errors.expMonth")}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="yearInput">
            <Form.Label>{t("forms.creditCard.labels.expYear")}</Form.Label>
            <Form.Select
              name="yearExpiry"
              onChange={handleChange as any}
              onFocus={handleFocus as any}
              onBlur={handleBlur}
              required
              isInvalid={isFieldInvalid("yearExpiry")}
              className="form-control"
            >
              <option value="">{t("forms.creditCard.labels.placeholders.select")}</option>
              {numOfYears.map((val) => (
                <option value={val} key={val}>
                  20{val}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{t("forms.creditCard.errors.expYear")}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Group controlId="cvvInput">
            <Form.Label>{t("forms.creditCard.labels.cvv")}</Form.Label>
            <Form.Control
              placeholder="***"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              onFocus={handleFocus as any}
              onBlur={handleBlur}
              pattern={`[0-9]{3,4}`}
              required
              type="password"
              minLength={3}
              maxLength={4}
              isInvalid={isFieldInvalid("cvv")}
            />
            <Form.Control.Feedback type="invalid">{t("forms.creditCard.errors.cvv")}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="zipCodeInput">
            <Form.Label>{t("forms.creditCard.labels.billingZip")}</Form.Label>
            <Form.Control
              placeholder={t("forms.creditCard.labels.placeholders.zipCode")}
              name="billingZip"
              value={formData.billingZip}
              onChange={handleChange}
              required
              type="text"
              autoComplete="off"
              isInvalid={isFieldInvalid("billingZip")}
            />
            <Form.Control.Feedback type="invalid">{t("forms.creditCard.errors.billingZip")}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default memo(DefaultCardDetailsForm);
