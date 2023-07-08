import axios from "axios";
import { type Handler } from "@netlify/functions";

import { getAuthProperties, responseHeaders, tokenRequestSchema } from "../../helpers/requestHelpers";
import { logAction } from "../../helpers/logActions";

const tokenHandler: Handler = async (event) => {
  if (event.httpMethod.toLowerCase() !== "post") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: responseHeaders,
    };
  }

  const requestIp = event.headers["x-nf-client-connection-ip"] ?? event.headers["client-ip"];

  const LOGGER_SERVICE_URI = process.env.LOGGER_SERVICE_URI;
  const LOGGER_SERVICE_ID = process.env.LOGGER_SERVICE_ID;

  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }), headers: responseHeaders };
    }

    const body = JSON.parse(event.body);
    const parsed = tokenRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => `${issue.path}: ${issue.message}`);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Errors: | ${errors.join(" | ")}` }),
        headers: responseHeaders,
      };
    }

    const { AUTH_URL, CLIENT_ID, CLIENT_SECRET } = getAuthProperties(parsed.data.environment);

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("scope", "Api");

    const { data } = await axios.post(AUTH_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (LOGGER_SERVICE_URI && LOGGER_SERVICE_ID && requestIp) {
      await logAction({ loggerUri: LOGGER_SERVICE_URI, loggerServiceId: LOGGER_SERVICE_ID }, "request-access-token", {
        ip: requestIp,
        environment: parsed.data.environment,
        lookupFilterValue: parsed.data.client_id,
        data: {
          clientId: parsed.data.client_id,
          referenceType: parsed.data.reference_type,
          referenceId: parsed.data.reference_id,
        },
      }).then(() => {});
    }

    return { statusCode: 200, body: JSON.stringify(data), headers: responseHeaders };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : "Fatal error occurred" }),
      headers: responseHeaders,
    };
  }
};

const handler = tokenHandler;

export { handler };
