import { useAuthStore } from "@/hooks/stores/useAuthStore";

export const clientFetch = (input: string, init?: RequestInit) =>
  fetch(`${useAuthStore.getState().base_url}${input}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
      Authorization: `${useAuthStore.getState().token_type} ${useAuthStore.getState().access_token}`,
    },
  });
