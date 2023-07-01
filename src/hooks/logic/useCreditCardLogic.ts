import React from "react";
import Payment from "payment";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactCreditCardsProps } from "react-credit-cards-2";

import i18n from "@/i18n";
import { CreditCardStoreType } from "@/hooks/stores/useFormStore";

type StateStorage = CreditCardStoreType["data"];

const creditCardSchema = z.object({
  name: z
    .string({ required_error: i18n.t("forms.creditCard.errors.name") })
    .min(1, i18n.t("forms.creditCard.errors.name")),
  type: z.string(),
  number: z
    .string()
    .refine((value) => Payment.fns.validateCardNumber(`${value}`), i18n.t("forms.creditCard.errors.cardNumber")),
  cvv: z
    .string({
      required_error: i18n.t("forms.creditCard.errors.cvv"),
    })
    .min(1, i18n.t("forms.creditCard.errors.cvv")),
  monthYearExpiry: z
    .string()
    .refine((value) => Payment.fns.validateCardExpiry(`${value}`), "Enter a valid expiration date"),
  billingZip: z
    .string({
      required_error: i18n.t("forms.creditCard.errors.billingZip"),
    })
    .min(1, i18n.t("forms.creditCard.errors.billingZip")),
});

type CreditCardSchema = z.infer<typeof creditCardSchema>;

export function useCreditCardLogic(initialData: StateStorage) {
  const [currentFocus, setCurrentFocus] = React.useState<NonNullable<ReactCreditCardsProps["focused"]>>("");
  const form = useForm<CreditCardSchema>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: initialData,
    criteriaMode: "all",
    mode: "onBlur",
  });

  const changeCurrentFocus = React.useCallback((name: NonNullable<ReactCreditCardsProps["focused"]>) => {
    setCurrentFocus(name);
  }, []);

  return { form, currentFocus, changeCurrentFocus } as const;
}
