import React from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import CreditCardDetailsForm from "@/components/credit-card-details-form";
import DynamicCreditCard from "@/components/dynamic-credit-card";
import { Button as UIButton } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useCreditCardLogic } from "@/hooks/logic/useCreditCardLogic";
import { useFormStore } from "@/hooks/stores/useFormStore";

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
              <DynamicCreditCard currentFocus={currentFocus} formData={values} />
            </div>
            <div className="mt-4">
              <CreditCardDetailsForm form={form} changeCurrentFocus={changeCurrentFocus} />
            </div>
            <div className="mt-6 flex">
              {isPreviousAvailable && (
                <div>
                  <UIButton variant="outline" onClick={goPrev}>
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
