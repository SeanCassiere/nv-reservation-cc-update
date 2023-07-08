import { APP_DEFAULTS } from "@/utils/constants";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AuthStoreType = {
  base_url: string;
  access_token: string | null;
  token_type: string;

  setAuthValues: (payload: { access_token: string; token_type: string; client_base_url: string }) => void;
};

export const useAuthStore = create(
  devtools<AuthStoreType>(
    (set) => ({
      base_url: APP_DEFAULTS.BASE_URL,
      access_token: null,
      token_type: "Bearer",

      setAuthValues: (payload) => {
        set(
          { access_token: payload.access_token, token_type: payload.token_type, base_url: payload.client_base_url },
          false,
          "setAuthValues"
        );
      },
    }),
    { enabled: true, name: "zustand/authStore" }
  )
);
