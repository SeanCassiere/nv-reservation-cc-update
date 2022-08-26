import axios from "axios";
import { setAccessToken } from "../redux/slices/auth/slice";
import store from "../redux/store";
import { isValueTrue } from "../utils/common";

const baseURL = import.meta.env.VITE_APP_API_BASE_URL_V3 || "https://api.apprentall.com/api/v3";
const baseURLQa = import.meta.env.VITE_APP_QA_API_BASE_URL_V3 || "https://testapi.appnavotar.com/api/v3";

export const AUTH_URL = "/api/token";
export const SUBMISSION_COMPLETION_URL = "/api/complete";

const isQa = isValueTrue(new URLSearchParams(window.location.search).get("qa"));

const clientV3 = axios.create({
  baseURL: isQa ? baseURLQa : baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

clientV3.interceptors.request.use(
  (config) => {
    const authConfig = store.getState().auth;

    if (config && config.headers) {
      config.headers["Authorization"] = `${authConfig.token_type} ${authConfig.access_token}`;
    }

    return config;
  },
  async (err) => {
    const originalRequest = err.config;
    const clientId = store.getState().config.clientId;

    if (!clientId) return Promise.reject(err);

    if (err.response.status === 401 && !originalRequest._retry && clientId !== null) {
      originalRequest._retry = true;
      try {
        const res = await clientV3.get(AUTH_URL);

        const { data } = res.data as { data: { access_token: string; token_type: string } };
        store.dispatch(setAccessToken({ access_token: data.access_token, token_type: data.token_type }));

        originalRequest.headers.Authorization = `${data.token_type} ${data.access_token}`;
        return clientV3(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

export default clientV3;

export async function makeCompletionRequest(failed: boolean) {
  const state = store.getState();

  const params = new URLSearchParams();
  if (state.config.qa) {
    params.append("qa", "true");
  }
  params.append("client_id", `${state.config.clientId}`);
  params.append("reference_type", `${state.config.referenceType}`);
  params.append("reference_id", `${state.retrievedDetails.referenceId}`);
  params.append("customer_id", `${state.retrievedDetails.data.customerId}`);
  params.append("status", failed ? "failure" : "success");
  return await axios
    .get(SUBMISSION_COMPLETION_URL, { params })
    .then(() => true)
    .catch(() => false);
}
