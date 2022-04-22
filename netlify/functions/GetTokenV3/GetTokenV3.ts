import { Handler } from "@netlify/functions";
import axios from "axios";

const isValueTrue = (value: string | undefined | null) => {
	return value && (value.toLowerCase() === "true" || value === "1");
};

export const handler: Handler = async (event, context) => {
	const qaQuery = event.queryStringParameters.qa;

	const isQa = isValueTrue(qaQuery);
	const url = isQa ? process.env.QA_V3_AUTH_URL : process.env.V3_AUTH_URL;
	const clientId = isQa ? process.env.QA_CLIENT_ID : process.env.CLIENT_ID;
	const clientSecret = isQa ? process.env.QA_CLIENT_SECRET : process.env.CLIENT_SECRET;

	try {
		const params = new URLSearchParams();
		params.append("grant_type", "client_credentials");
		params.append("client_id", clientId);
		params.append("client_secret", clientSecret);
		params.append("scope", "Api");
		const { data } = await axios.post(url, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		return { statusCode: 200, body: JSON.stringify(data) };
	} catch (error) {
		console.log(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: error }),
		};
	}
};
