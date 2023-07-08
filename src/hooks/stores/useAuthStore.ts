import { APP_DEFAULTS } from "@/utils/constants";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthStoreType = {
  baseUrl: string;
  access_token: string | null;
  token_type: string;

  setAuthValues: (payload: { access_token: string; token_type: string }) => void;
  setBaseUrl: (payload: { baseUrl: string }) => void;
};

export const useAuthStore = create(
  devtools<AuthStoreType>(
    (set) => ({
      baseUrl: APP_DEFAULTS.BASE_URL,
      access_token: null,
      token_type: "Bearer",

      setAuthValues: (payload) => {
        set({ access_token: payload.access_token, token_type: payload.token_type }, false, "setAuthValues");
      },
      setBaseUrl: (payload) => {
        set({ baseUrl: payload.baseUrl }, false, "setBaseUrl");
      },
    }),
    { enabled: true, name: "zustand/authStore" }
  )
);
