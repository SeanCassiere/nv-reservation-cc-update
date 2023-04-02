import React, { memo } from "react";
import Cards, { type ReactCreditCardsProps } from "react-credit-cards-2";
import { useTranslation } from "react-i18next";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import type { CreditCardStoreType } from "../../hooks/stores/useFormStore";

interface IProps {
  currentFocus: NonNullable<ReactCreditCardsProps["focused"]>;
  formData: CreditCardStoreType["data"];
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
