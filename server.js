const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const PORT = process.env.SERVER_PORT ?? 5000;
const AUTH_URL = process.env.V3_AUTH_URL ?? "https://auth.appnavotar.com/connect/token";
const CLIENT_ID = process.env.V3_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.V3_CLIENT_SECRET ?? "";

const app = express();

app.use(cors());

app.get("/api/GetTokenV3", async (req, res) => {
	try {
		const params = new URLSearchParams();
		params.append("grant_type", "client_credentials");
		params.append("client_id", CLIENT_ID);
		params.append("client_secret", CLIENT_SECRET);
		params.append("scope", "Api");
		const { data } = await axios.post(AUTH_URL, params, {
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
