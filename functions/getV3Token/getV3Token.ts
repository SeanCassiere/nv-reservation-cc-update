import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

export const handler: Handler = async (event, context) => {
	try {
		const v3Params = new URLSearchParams();
		v3Params.append("grant_type", "client_credentials");
		v3Params.append("client_id", process.env.REACT_APP_V3_CLIENT_ID);
		v3Params.append("client_secret", process.env.REACT_APP_V3_CLIENT_SECRET);
		v3Params.append("scope", "Api");
		const response = await fetch(process.env.REACT_APP_V3_AUTH_URL, {
			method: "POST",
			body: v3Params,
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		const data = await response.json();
		return { statusCode: 200, body: JSON.stringify(data) };
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Failed fetching data" }),
		};
	}
};
