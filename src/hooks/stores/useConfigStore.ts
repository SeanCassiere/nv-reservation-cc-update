import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { APP_CONSTANTS, APP_DEFAULTS } from "@/utils/constants";
import { SupportedEnvironments } from "@/utils/app-env";

const PROTECTED_FLOWS: string[] = [APP_CONSTANTS.FLOW_FORMS_SUMMARY];

type ConfigStoreType = {
  environment: SupportedEnvironments;
  flow: string[];
  fullFlow: string[];
  successSubmissionScreen: string;
  rawConfig: string;
  rawQueryString: string;

  isDevMenuOpen: boolean;
  predefinedAdminUserId: number;
  showPreSubmitSummary: boolean;
  disableGlobalDocumentsForConfirmationEmail: boolean;
  disableEmailAttachingDriverLicense: boolean;
  colorScheme: string;

  setDevMenuState: (newState: ((value: boolean) => boolean) | boolean) => void;
  setRawQuery: (payload: { rawConfig: string; rawQueryString: string }) => void;
  setConfigValues: (payload: {
    flow: string[];
    predefinedAdminUserId: number;
    successSubmissionScreen?: string;
    showPreSubmitSummary: boolean;
    disableGlobalDocumentsForConfirmationEmail: boolean;
    disableEmailAttachingDriverLicense: boolean;
    colorScheme: string;
    environment: SupportedEnvironments;
  }) => void;
};

export const useConfigStore = create(
  devtools<ConfigStoreType>(
    (set, get) => ({
      environment: APP_DEFAULTS.ENVIRONMENT,

      flow: APP_DEFAULTS.FLOW_SCREENS,
      fullFlow: APP_DEFAULTS.FLOW_SCREENS,

      successSubmissionScreen: APP_DEFAULTS.SUCCESS_SUBMISSION_SCREEN,
      rawConfig: "",
      rawQueryString: "",

      showPreSubmitSummary: false,
      isDevMenuOpen: false,
      predefinedAdminUserId: 0,
      disableGlobalDocumentsForConfirmationEmail: APP_DEFAULTS.STOP_EMAIL_GLOBAL_DOCUMENTS,
      disableEmailAttachingDriverLicense: APP_DEFAULTS.STOP_ATTACHING_DRIVER_LICENSE_FILES,
      colorScheme: APP_DEFAULTS.COLOR_SCHEME,

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
        successSubmissionScreen,
        showPreSubmitSummary,
        disableGlobalDocumentsForConfirmationEmail,
        disableEmailAttachingDriverLicense,
        predefinedAdminUserId,
        colorScheme,
        environment,
      }) {
        const filterFlow = flow.filter((flow) => !PROTECTED_FLOWS.includes(flow));
        const flowSet = new Set(filterFlow);
        const fullFlowSet = new Set(filterFlow);
        if (showPreSubmitSummary) {
          fullFlowSet.add(APP_CONSTANTS.FLOW_FORMS_SUMMARY);
        }

        set(
          {
            environment,
            ...(flow && flow.length > 0 ? { flow: Array.from(flowSet) } : {}),
            ...(flow && flow.length > 0 ? { fullFlow: Array.from(fullFlowSet) } : {}),
            ...(successSubmissionScreen ? { successSubmissionScreen } : {}),
            ...(showPreSubmitSummary ? { showPreSubmitSummary } : {}),
            disableGlobalDocumentsForConfirmationEmail: disableGlobalDocumentsForConfirmationEmail,
            disableEmailAttachingDriverLicense: disableEmailAttachingDriverLicense,
            predefinedAdminUserId: predefinedAdminUserId,
            colorScheme,
          },
          false,
          "setConfigValues"
        );
      },
    }),
    { enabled: true, name: "zustand/configStore" }
  )
);
