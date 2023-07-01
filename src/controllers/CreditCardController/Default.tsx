import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import { Button as UIButton } from "@/components/ui/button";
import DynamicCreditCardDefault from "@/components/DynamicCreditCard/Default";
import CardDetailsFormDefault from "@/components/CreditCardForm/Default";
import { Form } from "@/components/ui/form";

import { useFormStore } from "@/hooks/stores/useFormStore";
import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useCreditCardLogic } from "@/hooks/logic/useCreditCardLogic";

interface IProps {}

const DefaultCreditCardController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext } = useAppNavContext();

  const initialFormData = useFormStore((s) => s.customerCreditCard.data);
  const setCustomerCreditCardToStore = useFormStore((s) => s.setCustomerCreditCard);

  const { form, currentFocus, changeCurrentFocus } = useCreditCardLogic(initialFormData);
  const values = form.watch();

  const handleSubmit = form.handleSubmit(async (values) => {
    setCustomerCreditCardToStore(values);
    goNext();
  });

  return (
    <CardLayout title={t("forms.creditCard.title")} subtitle={t("forms.creditCard.message")}>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid grid-cols-1">
            <div className="my-4 md:my-2">
              <DynamicCreditCardDefault currentFocus={currentFocus} formData={values} />
            </div>
            <div className="mt-4">
              <CardDetailsFormDefault form={form} changeCurrentFocus={changeCurrentFocus} />
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
                <UIButton type="submit" className="w-full" onClick={handleSubmit}>
                  {nextPageText}
                </UIButton>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </CardLayout>
  );
};

export default DefaultCreditCardController;
