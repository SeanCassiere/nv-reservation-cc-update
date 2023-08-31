import { type Handler } from "@netlify/functions";

import { AuthorizationClient } from "../../helpers/auth.service";
import { formatZodErrors, GetTokenRequestSchema, ResponseHeaders } from "../../helpers/common";
import { LoggingClient } from "../../helpers/log.service";

const tokenHandler: Handler = async (event) => {
  if (event.httpMethod.toLowerCase() !== "post") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: ResponseHeaders,
    };
  }

  const requestIp = event.headers["x-nf-client-connection-ip"] ?? event.headers["client-ip"];

  const logger = LoggingClient.getLoggingService();

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

    const authService = AuthorizationClient.getAuthService(parsed.data.environment);
    const authData = await authService.getAccessToken();

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
        },
      )
      .then(() => {});

    return { statusCode: 200, body: JSON.stringify(authData), headers: ResponseHeaders };
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
