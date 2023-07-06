import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { APP_CONSTANTS } from "@/utils/constants";
import { GlobalDocumentForEmail } from "@/api/emailsApi";

export type ConfirmationEmailStoreType = {
  ccList: string[];
  toList: string[];
  dataUrl: string | null;
  fromEmail: string;
  fromName: string;
  subject: string;
  templateId: number;
  templateTypeId: number;
  globalDocuments: GlobalDocumentForEmail[];
};

export type RentalStoreType = {
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
  adminUserId: number;
  rental: RentalStoreType | null;
  referenceType: string;
  detailsHaveBeenSubmitted: boolean;
  referenceIdentifier: string | number | null;
  responseTemplateId: string | number | null;
  confirmationEmail: ConfirmationEmailStoreType | null;

  setClientId: (newClientId: string | number | null) => void;
  setReferenceInitValues: (payload: {
    newReferenceType: string;
    newReferenceIdentifier: string | number | null;
  }) => void;
  setEmailTemplateAndClientId: (payload: {
    newTemplateId: string | number | null;
    newClientId: string | number | null;
  }) => void;
  setRuntimeConfirmationEmail: (payload: RuntimeStoreType["confirmationEmail"]) => void;
  setRuntimeRental: (payload: RentalStoreType) => void;
  setRuntimeAdminUserId: (newAdminUserId: number) => void;
  setSubmissionCompleteState: (bool: boolean) => void;
  setRuntimeReferenceId: (newReferenceId: string | number | null) => void;
};

export const useRuntimeStore = create(
  devtools<RuntimeStoreType>(
    (set) => ({
      adminUserId: 0,
      clientId: null,
      rental: null,
      referenceType: APP_CONSTANTS.REF_TYPE_RESERVATION,
      detailsHaveBeenSubmitted: false,
      responseTemplateId: null,
      referenceIdentifier: null,
      confirmationEmail: null,

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
      setSubmissionCompleteState: (bool) =>
        set({ detailsHaveBeenSubmitted: bool }, false, `setSubmissionCompleteState/${bool}`),
      setRuntimeReferenceId: (newReferenceId) =>
        set({ referenceIdentifier: newReferenceId }, false, `setRuntimeReferenceId/${newReferenceId}`),
    }),
    { enabled: true, name: "zustand/runtimeStore" }
  )
);
