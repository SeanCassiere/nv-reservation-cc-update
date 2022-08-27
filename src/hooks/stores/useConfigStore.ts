import create from "zustand";
import { devtools } from "zustand/middleware";
import { APP_CONSTANTS } from "../../utils/constants";

type ConfigStoreType = {
  flow: string[];
  successSubmissionScreen: string;
  rawConfig: string;
  rawQueryString: string;
  fromRentall: boolean;
  qa: boolean;
  isDevMenuOpen: boolean;
  setDevMenuState: (newState: ((value: boolean) => boolean) | boolean) => void;
  setRawQuery: (payload: { rawConfig: string; rawQueryString: string }) => void;
  setConfigValues: (payload: {
    flow: string[];
    fromRentall: boolean;
    qa: boolean;
    successSubmissionScreen?: string;
  }) => void;
};

export const useConfigStore = create(
  devtools<ConfigStoreType>(
    (set, get) => ({
      flow: [APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_FORM],
      successSubmissionScreen: APP_CONSTANTS.SUCCESS_SCREEN_DEFAULT,
      rawConfig: "",
      rawQueryString: "",
      fromRentall: true,
      qa: false,
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

      setConfigValues({ flow, fromRentall, qa, successSubmissionScreen }) {
        set(
          {
            fromRentall: fromRentall === false ? false : true,
            qa: qa === true ? true : false,
            ...(flow ? { flow } : {}),
            ...(successSubmissionScreen ? { successSubmissionScreen } : {}),
          },
          false,
          "setConfigValues"
        );
      },
    }),
    { enabled: true, name: "zustand/configStore" }
  )
);
