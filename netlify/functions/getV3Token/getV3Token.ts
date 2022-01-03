import { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event, context) => {
	try {
		const params = new URLSearchParams();
		params.append("grant_type", "client_credentials");
		params.append("client_id", process.env.V3_CLIENT_ID);
		params.append("client_secret", process.env.V3_CLIENT_SECRET);
		params.append("scope", "Api");
		const { data } = await axios.post(process.env.V3_AUTH_URL, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		return { statusCode: 200, body: data };
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error }),
		};
	}
};
