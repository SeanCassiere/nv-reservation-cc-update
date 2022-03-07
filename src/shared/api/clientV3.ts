import axios from "axios";
import { setAccessToken } from "../redux/slices/config";
import store from "../redux/store";

const baseURL = process.env.REACT_APP_API_BASE_URL_V3 || "https://api.navotar.com/api/v3";
const AUTH_URL = process.env.REACT_APP_V3_AUTH_URL ?? "/.netlify/functions/GetTokenV3";

const clientV3 = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

clientV3.interceptors.request.use(
	(config) => {
		const authConfig = store.getState().config;

		if (config && config.headers) {
			config.headers["Authorization"] = `${authConfig.tokenType} ${authConfig.token}`;
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
				store.dispatch(setAccessToken({ token: data.access_token, tokenType: data.token_type }));

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
