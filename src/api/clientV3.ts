import { useAuthStore } from "../hooks/stores/useAuthStore";
import { isValueTrue } from "../utils/common";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL_V3 || "https://api.apprentall.com/api/v3";
const baseURLQa = import.meta.env.VITE_APP_QA_API_BASE_URL_V3 || "https://testapi.appnavotar.com/api/v3";

const isQa = isValueTrue(new URLSearchParams(window.location.search).get("qa"));

export const clientFetch = (input: string, init?: RequestInit) =>
  fetch(`${isQa ? baseURLQa : baseURL}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
      Authorization: `${useAuthStore.getState().token_type} ${useAuthStore.getState().access_token}`,
    },
  });
