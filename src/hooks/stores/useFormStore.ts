import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface GenericFormStoreType<T> {
  isFilled: boolean;
  data: T;
}

export type CreditCardStoreType = GenericFormStoreType<{
  name: string;
  type: string;
  number: string;
  cvv: string;
  billingZip: string;
  monthYearExpiry: string;
}>;

export type DriversLicenseStoreType = GenericFormStoreType<{
  frontImageUrl: string | null;
  frontImageName: string | null;
  backImageUrl: string | null;
  backImageName: string | null;
}>;

export type RentalSignatureStoreType = GenericFormStoreType<{ signatureUrl: string }>;

type ApplicationFormsStoreType = {
  customerCreditCard: CreditCardStoreType;
  driversLicense: DriversLicenseStoreType;
  rentalSignature: RentalSignatureStoreType;
};

interface FormStoreType extends ApplicationFormsStoreType {
  setCustomerCreditCard: (payload: CreditCardStoreType["data"]) => void;
  setDriversLicense: (payload: DriversLicenseStoreType["data"]) => void;
  setRentalSignature: (payload: RentalSignatureStoreType["data"]) => void;
  clearFormStateKey: (key: keyof ApplicationFormsStoreType) => void;
}

export const formsInitialState: ApplicationFormsStoreType = {
  customerCreditCard: {
    isFilled: false,
    data: {
      name: "",
      type: "",
      number: "",
      cvv: "",
      billingZip: "",
      monthYearExpiry: "",
    },
  },
  driversLicense: {
    isFilled: false,
    data: {
      frontImageUrl: null,
      frontImageName: null,
      backImageUrl: null,
      backImageName: null,
    },
  },
  rentalSignature: {
    isFilled: false,
    data: { signatureUrl: "" },
  },
};

export const useFormStore = create(
  devtools<FormStoreType>(
    (set) => ({
      customerCreditCard: formsInitialState.customerCreditCard,
      driversLicense: formsInitialState.driversLicense,
      rentalSignature: formsInitialState.rentalSignature,

      setCustomerCreditCard: (payload) =>
        set({ customerCreditCard: { isFilled: true, data: payload } }, false, "setCustomerCreditCard"),
      setDriversLicense: (payload) =>
        set({ driversLicense: { isFilled: true, data: payload } }, false, "setDriversLicense"),
      setRentalSignature: (payload) =>
        set({ rentalSignature: { isFilled: true, data: payload } }, false, "setRentalSignature"),

      clearFormStateKey: (key) =>
        set({ [key]: { data: formsInitialState[key]["data"], isFilled: false } }, false, `clearFormStateKey/${key}`),
    }),
    {
      enabled: true,
      name: "zustand/formsStore",
    },
  ),
);
