import { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event, context) => {
	try {
		const v3Params = new URLSearchParams();
		v3Params.append("grant_type", "client_credentials");
		v3Params.append("client_id", process.env.REACT_APP_V3_CLIENT_ID);
		v3Params.append("client_secret", process.env.REACT_APP_V3_CLIENT_SECRET);
		v3Params.append("scope", "Api");
		const { data } = await axios.post(process.env.REACT_APP_V3_AUTH_URL, v3Params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		return { statusCode: 200, body: JSON.stringify(data) };
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Failed fetching data" }),
		};
	}
};
