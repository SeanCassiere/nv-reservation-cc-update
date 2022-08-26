import create from "zustand";
import { devtools } from "zustand/middleware";

type AuthStoreType = {
  access_token: string | null;
  token_type: string;

  setAuthValues: (payload: { access_token: string; token_type: string }) => void;
};

export const useAuthStore = create(
  devtools<AuthStoreType>(
    (set) => ({
      access_token: null,
      token_type: "Bearer",

      setAuthValues: (payload) => {
        set({ access_token: payload.access_token, token_type: payload.token_type }, false, "setAuthValues");
      },
    }),
    { enabled: true, name: "zustand/authStore" }
  )
);
