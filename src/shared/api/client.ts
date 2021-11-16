import axios from "axios";
import { setAccessToken } from "../redux/slices/config";
import store from "../redux/store";

const baseURL = process.env.API_BASE_URL || "https://app.navotar.com/api";

const client = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

client.interceptors.request.use(
	(res) => {
		return res;
	},
	async (err) => {
		const originalRequest = err.config;
		const clientId = store.getState().config.clientId;

		if (!clientId) return Promise.reject(err);

		if (err.response.status === 401 && !originalRequest._retry && clientId !== null) {
			originalRequest._retry = true;
			try {
				const res = await client.post("/Login/GetClientSecretToken", {
					ClientId: clientId,
					ConsumerType: "Admin/Basic",
				});

				const { data } = res.data as { data: { apiToken: { access_token: string } } };
				store.dispatch(setAccessToken({ token: data.apiToken.access_token }));

				originalRequest.headers.Authorization = `Bearer ${data.apiToken.access_token}`;
				return client(originalRequest);
			} catch (error) {
				return Promise.reject(error);
			}
		}
		return Promise.reject(err);
	}
);

export default client;
