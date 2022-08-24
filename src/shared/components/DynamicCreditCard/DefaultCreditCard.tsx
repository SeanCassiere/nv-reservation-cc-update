import React, { memo } from "react";
import Cards from "react-credit-cards";
import { useTranslation } from "react-i18next";
import "react-credit-cards/es/styles-compiled.css";

import { ICreditCardFormData } from "../../redux/slices/forms/slice";

interface IProps {
  currentFocus: string;
  formData: ICreditCardFormData;
}

const DefaultCreditCard: React.FC<IProps> = ({ currentFocus, formData }) => {
  const { t } = useTranslation();
  const expiry = `${formData.monthExpiry}/${formData.yearExpiry}`;
  return (
    <Cards
      number={formData.number.replaceAll(" ", "").trim()}
      name={formData.name}
      cvc={formData.cvv}
      expiry={expiry}
      locale={{ valid: t("forms.creditCard.creditCardComponent.validThru") }}
      placeholders={{ name: t("forms.creditCard.creditCardComponent.yourName") }}
      focused={currentFocus as any}
    />
  );
};

export default memo(DefaultCreditCard);
