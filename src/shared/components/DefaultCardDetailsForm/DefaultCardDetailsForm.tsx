import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { ICreditCardFormData } from "../../redux/slices/forms/slice";
import { currentYearNum, range } from "../../utils/common";
import { YupErrorsFormatted } from "../../utils/yupSchemaErrors";

import SelectInput from "../Elements/SelectInput";
import TextInput from "../Elements/TextInput";

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
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <TextInput
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
          label={t("forms.creditCard.labels.cardNumber")}
          isError={isFieldInvalid("number")}
          helperText={isFieldInvalid("number") && t("forms.creditCard.errors.cardNumber")}
        />
      </div>
      <div className="col-span-2">
        <TextInput
          placeholder={t("forms.creditCard.labels.placeholders.name")}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onFocus={handleFocus as any}
          onBlur={handleBlur}
          required
          type="text"
          autoComplete="off"
          label={t("forms.creditCard.labels.nameOnCard")}
          isError={isFieldInvalid("name")}
          helperText={isFieldInvalid("name") && t("forms.creditCard.errors.name")}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <SelectInput
          name="monthExpiry"
          onChange={handleChange as any}
          onFocus={handleFocus as any}
          onBlur={handleBlur}
          required
          label={t("forms.creditCard.labels.expMonth")}
          isError={isFieldInvalid("monthExpiry")}
          helperText={isFieldInvalid("monthExpiry") && t("forms.creditCard.errors.expMonth")}
        >
          <option value="">{t("forms.creditCard.labels.placeholders.select")}</option>
          {numOfMonths.map((val) => (
            <option value={val.toString().length === 1 ? `0${val}` : val} key={val}>
              {val.toString().length === 1 ? `0${val}` : val}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="col-span-2 md:col-span-1">
        <SelectInput
          name="yearExpiry"
          onChange={handleChange as any}
          onFocus={handleFocus as any}
          onBlur={handleBlur}
          required
          label={t("forms.creditCard.labels.expYear")}
          isError={isFieldInvalid("yearExpiry")}
          helperText={isFieldInvalid("yearExpiry") && t("forms.creditCard.errors.expYear")}
        >
          <option value="">{t("forms.creditCard.labels.placeholders.select")}</option>
          {numOfYears.map((val) => (
            <option value={val} key={val}>
              20{val}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="col-span-2 md:col-span-1">
        <TextInput
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
          autoComplete="off"
          label={t("forms.creditCard.labels.cvv")}
          isError={isFieldInvalid("cvv")}
          helperText={isFieldInvalid("cvv") && t("forms.creditCard.errors.cvv")}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <TextInput
          placeholder={t("forms.creditCard.labels.placeholders.zipCode")}
          name="billingZip"
          value={formData.billingZip}
          onChange={handleChange}
          required
          type="text"
          autoComplete="off"
          label={t("forms.creditCard.labels.placeholders.zipCode")}
          isError={isFieldInvalid("billingZip")}
          helperText={isFieldInvalid("billingZip") && t("forms.creditCard.errors.billingZip")}
        />
      </div>
    </div>
  );
};

export default memo(DefaultCardDetailsForm);
