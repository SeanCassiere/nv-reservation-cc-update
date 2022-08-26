import create from "zustand";
import { devtools } from "zustand/middleware";
import { APP_CONSTANTS } from "../utils/constants";

type ConfirmationEmailStoreType = {
  ccList: string[];
  dataUrl: string | null;
  fromAddress: string;
  fromName: string;
  subject: string;
  templateId: number;
  templateTypeId: number;
};

type RentalStoreType = {
  customerEmail: string;
  customerId: number;
  driverId: number;
  driverName: string;
  isCheckIn: boolean;
  locationEmail: string;
  locationId: number;
  referenceId: number;
  referenceNo: string;
};

type RuntimeStoreType = {
  clientId: string | number | null;
  responseTemplateId: string | number | null;
  referenceType: string;
  referenceIdentifier: string | number | null;
  confirmationEmail: ConfirmationEmailStoreType | null;
  rental: RentalStoreType | null;
  adminUserId: number;

  setClientId: (newClientId: string | number | null) => void;
  setReferenceInitValues: (payload: {
    newReferenceType: string;
    newReferenceIdentifier: string | number | null;
  }) => void;
  setEmailTemplateAndClientId: (payload: {
    newTemplateId: string | number | null;
    newClientId: string | number | null;
  }) => void;
  setRuntimeConfirmationEmail: (payload: ConfirmationEmailStoreType) => void;
  setRuntimeRental: (payload: RentalStoreType) => void;
  setRuntimeAdminUserId: (newAdminUserId: number) => void;
};

export const useRuntimeStore = create(
  devtools<RuntimeStoreType>(
    (set) => ({
      clientId: null,
      responseTemplateId: null,
      referenceIdentifier: null,
      referenceType: APP_CONSTANTS.REF_TYPE_RESERVATION,
      confirmationEmail: null,
      rental: null,
      adminUserId: 0,

      setClientId: (newClientId) => set({ clientId: newClientId }, false, "setClientId"),
      setReferenceInitValues: (payload) => {
        set(
          { referenceType: payload.newReferenceType, referenceIdentifier: payload.newReferenceIdentifier },
          false,
          "setReferenceInitValues"
        );
      },
      setEmailTemplateAndClientId: (payload) => {
        set(
          { responseTemplateId: payload.newTemplateId, clientId: payload.newClientId },
          false,
          "setEmailTemplateAndClientId"
        );
      },
      setRuntimeConfirmationEmail: (payload) =>
        set({ confirmationEmail: payload }, false, "setRuntimeConfirmationEmail"),
      setRuntimeRental: (payload) => set({ rental: payload }, false, "setRuntimeRental"),
      setRuntimeAdminUserId: (num) => set({ adminUserId: num }, false, "setRuntimeAdminUserId"),
    }),
    { enabled: true, name: "zustand/runtimeStore" }
  )
);
