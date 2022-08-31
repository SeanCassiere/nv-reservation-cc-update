import create from "zustand";
import { devtools } from "zustand/middleware";
import { APP_CONSTANTS } from "../../utils/constants";

const PROTECTED_FLOWS: string[] = [APP_CONSTANTS.FLOW_FORMS_SUMMARY];

type ConfigStoreType = {
  flow: string[];
  fullFlow: string[];
  successSubmissionScreen: string;
  rawConfig: string;
  rawQueryString: string;
  fromRentall: boolean;
  qa: boolean;
  isDevMenuOpen: boolean;
  showPreSubmitSummary: boolean;
  setDevMenuState: (newState: ((value: boolean) => boolean) | boolean) => void;
  setRawQuery: (payload: { rawConfig: string; rawQueryString: string }) => void;
  setConfigValues: (payload: {
    flow: string[];
    fromRentall: boolean;
    qa: boolean;
    successSubmissionScreen?: string;
    showPreSubmitSummary: boolean;
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
      fromRentall: true,
      qa: false,
      showPreSubmitSummary: false,
      isDevMenuOpen: false,

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

      setConfigValues({ flow, fromRentall, qa, successSubmissionScreen, showPreSubmitSummary }) {
        const filterFlow = flow.filter((flow) => !PROTECTED_FLOWS.includes(flow));
        const flowSet = new Set(filterFlow);
        const fullFlowSet = new Set(filterFlow);
        if (showPreSubmitSummary) {
          fullFlowSet.add(APP_CONSTANTS.FLOW_FORMS_SUMMARY);
        }
        set(
          {
            fromRentall: fromRentall === false ? false : true,
            qa: qa === true ? true : false,
            ...(flow ? { flow: Array.from(flowSet) } : {}),
            ...(flow ? { fullFlow: Array.from(fullFlowSet) } : {}),
            ...(successSubmissionScreen ? { successSubmissionScreen } : {}),
            ...(showPreSubmitSummary ? { showPreSubmitSummary } : {}),
          },
          false,
          "setConfigValues"
        );
      },
    }),
    { enabled: true, name: "zustand/configStore" }
  )
);
