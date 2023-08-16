import axios from "axios";
import { type Handler } from "@netlify/functions";

import { getAuthProperties } from "../../helpers/requestHelpers";
import { formatZodErrors, ResponseHeaders, GetTokenRequestSchema } from "../../helpers/common";
import { LoggingService } from "../../helpers/log.service";

const tokenHandler: Handler = async (event) => {
  if (event.httpMethod.toLowerCase() !== "post") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: ResponseHeaders,
    };
  }

  const requestIp = event.headers["x-nf-client-connection-ip"] ?? event.headers["client-ip"];

  const logger = LoggingService.createLogger();

  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }), headers: ResponseHeaders };
    }

    const body = JSON.parse(event.body);
    const parsed = GetTokenRequestSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: formatZodErrors(parsed.error.issues) }),
        headers: ResponseHeaders,
      };
    }

    const { AUTH_URL, CLIENT_ID, CLIENT_SECRET, BASE_URL } = getAuthProperties(parsed.data.environment);

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("scope", "Api");

    const { data } = await axios.post(AUTH_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    logger
      .save(
        "request-access-token",
        {
          clientId: parsed.data.client_id,
          referenceType: parsed.data.reference_type,
          referenceId: parsed.data.reference_id,
        },
        {
          appEnvironment: parsed.data.environment,
          lookup: parsed.data.client_id,
          ip: requestIp,
        }
      )
      .then(() => {});

    return { statusCode: 200, body: JSON.stringify({ ...data, client_base_url: BASE_URL }), headers: ResponseHeaders };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error instanceof Error ? error.message : "Fatal error occurred" }),
      headers: ResponseHeaders,
    };
  }
};

const handler = tokenHandler;

export { handler };
