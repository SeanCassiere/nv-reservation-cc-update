import React, { memo } from "react";
import { useTranslation } from "react-i18next";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useCreditCardLogic } from "@/hooks/logic/useCreditCardLogic";
import { formatCreditCardNumber, getFormattedExpirationDate, creditCardTypeFormat } from "@/utils/creditCardTypeFormat";

type CreditCardFormHook = ReturnType<typeof useCreditCardLogic>["form"];
type ChangeCurrentFocusFn = ReturnType<typeof useCreditCardLogic>["changeCurrentFocus"];

interface IProps {
  form: CreditCardFormHook;
  changeCurrentFocus: ChangeCurrentFocusFn;
}

const DefaultCardDetailsForm: React.FC<IProps> = ({ form, changeCurrentFocus }) => {
  const { t } = useTranslation();

  const onFocus = (name: Parameters<ChangeCurrentFocusFn>[0]) => () => {
    changeCurrentFocus(name);
  };
  const clearFocus = () => {
    changeCurrentFocus("");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.creditCard.labels.cardNumber")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="xxxx xxxx xxxx xxxx"
                  autoComplete="cc-number"
                  inputMode="numeric"
                  onFocus={onFocus("number")}
                  {...field}
                  onBlur={() => {
                    clearFocus();
                    field.onBlur();
                  }}
                  onChange={(e) => {
                    const formattedCardNumber = formatCreditCardNumber(e.target.value);
                    e.target.value = formattedCardNumber;
                    form.setValue("type", creditCardTypeFormat(formattedCardNumber));
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <FormField
          control={form.control}
          name="monthYearExpiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.creditCard.labels.expMonthYear")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("forms.creditCard.labels.placeholders.expMonthYear")}
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  onFocus={onFocus("expiry")}
                  {...field}
                  onBlur={() => {
                    clearFocus();
                    field.onBlur();
                  }}
                  onChange={(e) => {
                    e.target.value = getFormattedExpirationDate(e.target.value).monthYearExpiry;
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-2 md:col-span-1">
        <FormField
          control={form.control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.creditCard.labels.cvv")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="***"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  pattern={`[0-9]{3,4}`}
                  type="password"
                  minLength={3}
                  maxLength={4}
                  onFocus={onFocus("cvc")}
                  {...field}
                  onBlur={() => {
                    clearFocus();
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.creditCard.labels.nameOnCard")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("forms.creditCard.labels.placeholders.name")}
                  autoComplete="cc-name"
                  onFocus={onFocus("name")}
                  {...field}
                  onBlur={() => {
                    clearFocus();
                    field.onBlur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="billingZip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("forms.creditCard.labels.billingZip")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("forms.creditCard.labels.placeholders.zipCode")}
                  autoComplete="postal-code"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

// const DefaultCardDetailsForm: React.FC<IProps> = ({
//   formData,
//   handleBlur,
//   handleFocus,
//   handleChange,
//   schemaErrors,
// }) => {
//   const { t } = useTranslation();

//   const isFieldInvalid = (field: string) => {
//     const findIfAvailable = schemaErrors.find((error) => error.path === field);
//     if (findIfAvailable) {
//       return findIfAvailable;
//     }
//     return undefined;
//   };

//   const passOnChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
//     if (e.target.name === "number") {
//       e.target.value = formatCreditCardNumber(e.target.value);
//       handleChange(e);
//       return;
//     }
//     handleChange(e);
//   };

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       <div className="col-span-2">
//         <TextInput
//           placeholder="xxxx xxxx xxxx xxxx"
//           name="number"
//           value={formData.number}
//           onChange={passOnChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           required
//           type="text"
//           autoComplete="cc-number"
//           label={t("forms.creditCard.labels.cardNumber")}
//           isError={Boolean(isFieldInvalid("number"))}
//           helperText={Boolean(isFieldInvalid("number")) && isFieldInvalid("number")?.message}
//           inputMode="numeric"
//         />
//       </div>
//       <div className="col-span-2 md:col-span-1">
//         <TextInput
//           placeholder={t("forms.creditCard.labels.placeholders.expMonthYear") as string}
//           name="monthYearExpiry"
//           value={formData.monthYearExpiry}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           required
//           type="text"
//           autoComplete="cc-exp"
//           label={t("forms.creditCard.labels.expMonthYear")}
//           isError={Boolean(isFieldInvalid("monthYearExpiry"))}
//           helperText={Boolean(isFieldInvalid("monthYearExpiry")) && isFieldInvalid("monthYearExpiry")?.message}
//           inputMode="numeric"
//         />
//       </div>
//       <div className="col-span-2 md:col-span-1">
//         <TextInput
//           placeholder="***"
//           name="cvv"
//           value={formData.cvv}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           pattern={`[0-9]{3,4}`}
//           required
//           type="password"
//           minLength={3}
//           maxLength={4}
//           autoComplete="cc-csc"
//           label={t("forms.creditCard.labels.cvv")}
//           isError={Boolean(isFieldInvalid("cvv"))}
//           helperText={Boolean(isFieldInvalid("cvv")) && isFieldInvalid("cvv")?.message}
//           inputMode="numeric"
//         />
//       </div>
//       <div className="col-span-2">
//         <TextInput
//           placeholder={t("forms.creditCard.labels.placeholders.name") as string}
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           required
//           type="text"
//           autoComplete="cc-name"
//           label={t("forms.creditCard.labels.nameOnCard")}
//           isError={Boolean(isFieldInvalid("name"))}
//           helperText={Boolean(isFieldInvalid("name")) && isFieldInvalid("name")?.message}
//         />
//       </div>
//       <div className="col-span-2">
//         <TextInput
//           placeholder={t("forms.creditCard.labels.placeholders.zipCode") as string}
//           name="billingZip"
//           value={formData.billingZip}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           onBlur={handleBlur}
//           required
//           type="text"
//           autoComplete="postal-code"
//           label={t("forms.creditCard.labels.placeholders.zipCode")}
//           isError={Boolean(isFieldInvalid("billingZip"))}
//           helperText={Boolean(isFieldInvalid("billingZip")) && isFieldInvalid("billingZip")?.message}
//         />
//       </div>
//     </div>
//   );
// };

export default memo(DefaultCardDetailsForm);
