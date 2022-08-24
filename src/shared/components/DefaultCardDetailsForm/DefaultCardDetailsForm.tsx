import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { ICreditCardFormData } from "../../redux/slices/forms/slice";
import { formatCreditCardNumber } from "../../utils/creditCardTypeFormat";
import { YupErrorsFormatted } from "../../utils/yupSchemaErrors";

import TextInput from "../Elements/TextInput";

interface IProps {
  formData: ICreditCardFormData;
  schemaErrors: YupErrorsFormatted;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  handleFocus: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

const DefaultCardDetailsForm = ({ formData, handleBlur, handleFocus, handleChange, schemaErrors }: IProps) => {
  const { t } = useTranslation();

  const isFieldInvalid = (field: string) => {
    const findIfAvailable = schemaErrors.find((error) => error.path === field);
    if (findIfAvailable) {
      return true;
    }
    return undefined;
  };

  const passOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "number") {
      e.target.value = formatCreditCardNumber(e.target.value);
      handleChange(e);
      return;
    }
    handleChange(e);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <TextInput
          placeholder="XXXX XXXX XXXX XXXX"
          name="number"
          value={formData.number}
          onChange={passOnChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          type="text"
          autoComplete="off"
          label={t("forms.creditCard.labels.cardNumber")}
          isError={Boolean(isFieldInvalid("number"))}
          helperText={isFieldInvalid("number") && t("forms.creditCard.errors.cardNumber")}
        />
      </div>
      <div className="col-span-2">
        <TextInput
          placeholder={t("forms.creditCard.labels.placeholders.name")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          type="text"
          autoComplete="off"
          label={t("forms.creditCard.labels.nameOnCard")}
          isError={Boolean(isFieldInvalid("name"))}
          helperText={isFieldInvalid("name") && t("forms.creditCard.errors.name")}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <TextInput
          placeholder={t("forms.creditCard.labels.placeholders.expMonthYear")}
          name="monthYearExpiry"
          value={formData.monthYearExpiry}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          type="text"
          autoComplete="off"
          label={t("forms.creditCard.labels.expMonthYear")}
          isError={Boolean(isFieldInvalid("monthYearExpiry"))}
          helperText={isFieldInvalid("monthYearExpiry") && t("forms.creditCard.errors.expMonthYear")}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <TextInput
          placeholder="***"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          pattern={`[0-9]{3,4}`}
          required
          type="password"
          minLength={3}
          maxLength={4}
          autoComplete="off"
          label={t("forms.creditCard.labels.cvv")}
          isError={Boolean(isFieldInvalid("cvv"))}
          helperText={isFieldInvalid("cvv") && t("forms.creditCard.errors.cvv")}
        />
      </div>
      <div className="col-span-2">
        <TextInput
          placeholder={t("forms.creditCard.labels.placeholders.zipCode")}
          name="billingZip"
          value={formData.billingZip}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          type="text"
          autoComplete="off"
          label={t("forms.creditCard.labels.placeholders.zipCode")}
          isError={Boolean(isFieldInvalid("billingZip"))}
          helperText={isFieldInvalid("billingZip") && t("forms.creditCard.errors.billingZip")}
        />
      </div>
    </div>
  );
};

export default memo(DefaultCardDetailsForm);
