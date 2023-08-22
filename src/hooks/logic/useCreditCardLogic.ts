import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Payment from "payment";
import { ReactCreditCardsProps } from "react-credit-cards-2";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { CreditCardStoreType } from "@/hooks/stores/useFormStore";
import i18n from "@/i18n";

type StateStorage = CreditCardStoreType["data"];

const creditCardSchema = z.object({
  name: z
    .string({ required_error: i18n.t("forms.creditCard.errors.name") as unknown as string })
    .min(1, i18n.t("forms.creditCard.errors.name") as unknown as string),
  type: z.string(),
  number: z
    .string()
    .refine(
      (value) => Payment.fns.validateCardNumber(`${value}`),
      i18n.t("forms.creditCard.errors.cardNumber") as unknown as string,
    ),
  cvv: z
    .string({
      required_error: i18n.t("forms.creditCard.errors.cvv") as unknown as string,
    })
    .min(1, i18n.t("forms.creditCard.errors.cvv") as unknown as string),
  monthYearExpiry: z
    .string()
    .refine((value) => Payment.fns.validateCardExpiry(`${value}`), "Enter a valid expiration date"),
  billingZip: z
    .string({
      required_error: i18n.t("forms.creditCard.errors.billingZip"),
    })
    .min(1, i18n.t("forms.creditCard.errors.billingZip") as unknown as string),
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
