import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { APP_CONSTANTS } from "../../utils/constants";

const PROTECTED_FLOWS: string[] = [APP_CONSTANTS.FLOW_FORMS_SUMMARY];

type ConfigStoreType = {
  flow: string[];
  fullFlow: string[];
  successSubmissionScreen: string;
  rawConfig: string;
  rawQueryString: string;
  qa: boolean;
  isDevMenuOpen: boolean;
  predefinedAdminUserId: number;
  showPreSubmitSummary: boolean;
  disableGlobalDocumentsForConfirmationEmail: boolean;
  disableEmailAttachingDriverLicense: boolean;
  theme: string;

  setDevMenuState: (newState: ((value: boolean) => boolean) | boolean) => void;
  setRawQuery: (payload: { rawConfig: string; rawQueryString: string }) => void;
  setConfigValues: (payload: {
    flow: string[];
    qa: boolean;
    predefinedAdminUserId: number;
    successSubmissionScreen?: string;
    showPreSubmitSummary: boolean;
    disableGlobalDocumentsForConfirmationEmail: boolean;
    disableEmailAttachingDriverLicense: boolean;
    theme: string;
  }) => void;
};

export const useConfigStore = create(
  devtools<ConfigStoreType>(
    (set, get) => ({
      flow: [APP_CONSTANTS.FLOW_CREDIT_CARD_FORM],
      fullFlow: [APP_CONSTANTS.FLOW_CREDIT_CARD_FORM],
      successSubmissionScreen: APP_CONSTANTS.SUCCESS_DEFAULT,
      rawConfig: "",
      rawQueryString: "",
      qa: false,
      showPreSubmitSummary: false,
      isDevMenuOpen: false,
      predefinedAdminUserId: 0,
      disableGlobalDocumentsForConfirmationEmail: false,
      disableEmailAttachingDriverLicense: false,
      theme: "",

      setDevMenuState: (newState: ((value: boolean) => boolean) | boolean) => {
        if (typeof newState === "function") {
          set({ isDevMenuOpen: newState(get().isDevMenuOpen) }, false, "setDevMenuState");
        }
        if (typeof newState === "boolean") {
          set({ isDevMenuOpen: newState }, false, "setDevMenuState");
        }
      },

      setRawQuery({ rawConfig, rawQueryString }) {
        set({ rawConfig, rawQueryString }, false, "setRawQuery");
      },

      setConfigValues({
        flow,
        qa,
        successSubmissionScreen,
        showPreSubmitSummary,
        disableGlobalDocumentsForConfirmationEmail,
        disableEmailAttachingDriverLicense,
        predefinedAdminUserId,
        theme,
      }) {
        const filterFlow = flow.filter((flow) => !PROTECTED_FLOWS.includes(flow));
        const flowSet = new Set(filterFlow);
        const fullFlowSet = new Set(filterFlow);
        if (showPreSubmitSummary) {
          fullFlowSet.add(APP_CONSTANTS.FLOW_FORMS_SUMMARY);
        }

        set(
          {
            qa: qa === true ? true : false,
            ...(flow && flow.length > 0 ? { flow: Array.from(flowSet) } : {}),
            ...(flow && flow.length > 0 ? { fullFlow: Array.from(fullFlowSet) } : {}),
            ...(successSubmissionScreen ? { successSubmissionScreen } : {}),
            ...(showPreSubmitSummary ? { showPreSubmitSummary } : {}),
            disableGlobalDocumentsForConfirmationEmail: disableGlobalDocumentsForConfirmationEmail,
            disableEmailAttachingDriverLicense: disableEmailAttachingDriverLicense,
            predefinedAdminUserId: predefinedAdminUserId,
            theme,
          },
          false,
          "setConfigValues"
        );
      },
    }),
    { enabled: true, name: "zustand/configStore" }
  )
);
