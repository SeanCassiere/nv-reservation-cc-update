const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const PORT = process.env.SERVER_PORT ?? 5000;
const AUTH_URL = process.env.V3_AUTH_URL ?? "https://auth.appnavotar.com/connect/token";
const CLIENT_ID = process.env.V3_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.V3_CLIENT_SECRET ?? "";

const AUTH_URL_QA = process.env.QA_V3_AUTH_URL ?? "https://testauth.appnavotar.com/connect/token";
const CLIENT_ID_QA = process.env.QA_V3_CLIENT_ID ?? "";
const CLIENT_SECRET_QA = process.env.QA_V3_CLIENT_SECRET ?? "";

const app = express();

app.use(cors());

const isValueTrue = (value) => {
	return value && (value.toLowerCase() === "true" || value === "1");
};

app.get("/api/GetTokenV3", async (req, res) => {
	const qaQuery = req.query.qa;

	const isQa = isValueTrue(qaQuery);
	const url = isQa ? AUTH_URL_QA : AUTH_URL;
	const clientId = isQa ? CLIENT_ID_QA : CLIENT_ID;
	const clientSecret = isQa ? CLIENT_SECRET_QA : CLIENT_SECRET;

	console.log({ dateTime: new Date().toISOString(), authEnvironment: isQa ? "QA" : "PROD", authUrl: url });

	try {
		const params = new URLSearchParams();
		params.append("grant_type", "client_credentials");
		params.append("client_id", clientId);
		params.append("client_secret", clientSecret);
		params.append("scope", "Api");

		const { data } = await axios.post(url, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});

		return res.status(200).json(data);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

app.listen(PORT, () => {
	console.log(`Mockup cloud functions server is running on port ${PORT}`);
});
