import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Button as UIButton } from "@/components/ui/button";
import CardLayout from "../../layouts/Card";
import DynamicCreditCardDefault from "../../components/DynamicCreditCard/Default";
import CardDetailsFormDefault from "../../components/CreditCardForm/Default";

import { useCreditCardLogic } from "../../hooks/logic/useCreditCardLogic";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useAppNavContext } from "../../hooks/logic/useAppNavContext";

interface IProps {}

const DefaultCreditCardController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext } = useAppNavContext();

  const initialFormData = useFormStore((s) => s.customerCreditCard.data);
  const setCustomerCreditCardToStore = useFormStore((s) => s.setCustomerCreditCard);

  const {
    validateCardData,
    handleCardInputChange,
    handleCardInputBlur,
    handleCardInputFocus,
    currentFocus,
    schemaErrors,
    formValues,
  } = useCreditCardLogic(initialFormData);

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    await validateCardData((values) => {
      setCustomerCreditCardToStore(values);
      goNext();
    });
  }, [goNext, setCustomerCreditCardToStore, validateCardData]);

  return (
    <CardLayout title={t("forms.creditCard.title")} subtitle={t("forms.creditCard.message")}>
      <div className="mt-4 grid grid-cols-1">
        <div className="my-4 md:my-2">
          <DynamicCreditCardDefault currentFocus={currentFocus} formData={formValues} />
        </div>
        <div className="mt-4">
          <CardDetailsFormDefault
            formData={formValues}
            handleChange={handleCardInputChange}
            handleBlur={handleCardInputBlur}
            handleFocus={handleCardInputFocus}
            schemaErrors={schemaErrors}
          />
        </div>
        <div className="mt-6 flex">
          {isPreviousAvailable && (
            <div>
              <UIButton variant="secondary" onClick={goPrev}>
                {prevPageText}
              </UIButton>
            </div>
          )}
          <div className={isPreviousAvailable ? "flex-1 pl-2" : "flex-1"}>
            <UIButton className="w-full" onClick={handleNextState}>
              {nextPageText}
            </UIButton>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultCreditCardController;
