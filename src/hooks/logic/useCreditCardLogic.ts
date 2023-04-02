import React from "react";
import Payment from "payment";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import type { ReactCreditCardsProps } from "react-credit-cards-2";

import { creditCardTypeFormat, getFormattedExpirationDate } from "../../utils/creditCardTypeFormat";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import { CreditCardStoreType, formsInitialState } from "../stores/useFormStore";

const storeKeys = Object.keys(formsInitialState.customerCreditCard.data);

type StateStorage = CreditCardStoreType["data"];

const formKeys = ["name", "type", "number", "cvv", "monthYearExpiry", "billingZip"] as const;

export const useCreditCardLogic = (initialData: StateStorage) => {
  const { t } = useTranslation();

  const [currentFocus, setCurrentFocus] = React.useState<NonNullable<ReactCreditCardsProps["focused"]>>("");
  const [values, setValues] = React.useState<StateStorage>(initialData);
  const [schemaErrors, setSchemaErrors] = React.useState<YupErrorsFormatted>([]);

  const schema = React.useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required(t("forms.creditCard.errors.name") as unknown as string),
        type: yup.string().required(),
        number: yup
          .string()
          .test("test-number", t("forms.creditCard.errors.cardNumber") as unknown as string, (value) =>
            Payment.fns.validateCardNumber(`${value}`)
          )
          .required(t("forms.creditCard.errors.cardNumber") as unknown as string),
        cvv: yup.string().required(t("forms.creditCard.errors.cvv") as unknown as string),
        monthYearExpiry: yup
          .string()
          .test("test", "Enter a valid expiration date", (value) => Payment.fns.validateCardExpiry(`${value}`))
          .required(),
        billingZip: yup.string().required(t("forms.creditCard.errors.billingZip") as unknown as string),
      }),
    [t]
  );

  const handleCardInputChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      if (!storeKeys.includes(evt.target.name)) return;

      const obj = {} as StateStorage;

      if (evt.target.name === "name") {
        obj.name = evt.target.value;
      }
      if (evt.target.name === "number") {
        obj.type = creditCardTypeFormat(evt.target.value);
        obj.number = evt.target.value;
      }
      if (evt.target.name === "cvv") {
        obj.cvv = evt.target.value;
      }
      if (evt.target.name === "billingZip") {
        obj.billingZip = evt.target.value;
      }
      if (evt.target.name === "monthYearExpiry") {
        const result = getFormattedExpirationDate(evt.target.value);
        obj.monthExpiry = result.monthExpiry;
        obj.yearExpiry = result.yearExpiry;
        obj.monthYearExpiry = result.monthYearExpiry;
      }
      if (evt.target.name === "monthExpiry") {
        obj.monthExpiry = evt.target.value;
      }
      if (evt.target.name === "yearExpiry") {
        obj.yearExpiry = evt.target.value;
      }

      setValues((prev) => ({
        ...prev,
        ...obj,
      }));
    },
    []
  );

  const handleCardInputFocus = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      if (
        evt.target.name === "monthExpiry" ||
        evt.target.name === "yearExpiry" ||
        evt.target.name === "monthYearExpiry"
      ) {
        setCurrentFocus("expiry");
      } else if (evt.target.name === "cvv") {
        setCurrentFocus("cvc");
      } else if (["name", "number"].includes(evt.target.name)) {
        setCurrentFocus(evt.target.name as any);
      }
    },
    []
  );

  const handleCardInputBlur = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
      setCurrentFocus("");
      try {
        if (formKeys.includes(e.target.name as any)) {
          const fieldName = e.target.name as (typeof formKeys)[number];
          const pickedSchema = schema.pick([fieldName]);
          if (fieldName === "number") {
            await pickedSchema.validate({ [fieldName]: e.target.value.replaceAll(" ", "") }, { abortEarly: false });
          } else {
            await pickedSchema.validate({ [fieldName]: e.target.value }, { abortEarly: false });
          }
        }
        setSchemaErrors((prev) => prev.filter((item) => item.path !== e.target.name));
      } catch (error) {
        const err = error as yup.ValidationError;
        const formErrors = yupFormatSchemaErrors(err);
        setSchemaErrors((prev) => {
          const cloneList = prev.filter((item) => item.path !== e.target.name);
          return [...cloneList, ...formErrors];
        });
      }
    },
    [schema]
  );

  const validateCardData = React.useCallback(
    async (cb: (data: StateStorage) => void) => {
      try {
        await schema.validate(values, { abortEarly: false });
        cb(values);
        return true;
      } catch (error: any) {
        const err = error as yup.ValidationError;
        const formErrors = yupFormatSchemaErrors(err);
        setSchemaErrors(formErrors);
        return false;
      }
    },
    [schema, values]
  );

  const isValidCheck = React.useCallback(async () => {
    return await schema.isValid(values);
  }, [schema, values]);

  const clearErrors = React.useCallback(() => {
    setSchemaErrors([]);
  }, []);

  return {
    schema,
    formValues: values,
    currentFocus,
    schemaErrors,
    isValidCheck,
    clearErrors,
    handleCardInputChange,
    handleCardInputFocus,
    handleCardInputBlur,
    validateCardData,
  };
};
