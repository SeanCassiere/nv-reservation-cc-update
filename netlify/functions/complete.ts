import { type Handler } from "@netlify/functions";

import { formatZodErrors, requestCompletionSchema, responseHeaders } from "../../helpers/requestHelpers";
import { logAction } from "../../helpers/logActions";

const completionHandler: Handler = async (event) => {
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
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing body" }),
        headers: responseHeaders,
      };
    }

    const body = JSON.parse(event.body);
    const parsed = requestCompletionSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: formatZodErrors(parsed.error.issues) }),
        headers: responseHeaders,
      };
    }

    if (LOGGER_SERVICE_URI && LOGGER_SERVICE_ID) {
      await logAction({ loggerUri: LOGGER_SERVICE_URI, loggerServiceId: LOGGER_SERVICE_ID }, "submitted-details", {
        ip: requestIp,
        environment: parsed.data.environment,
        lookupFilterValue: parsed.data.client_id,
        data: {
          status: parsed.data.status,
          clientId: parsed.data.client_id,
          referenceType: parsed.data.reference_type,
          referenceId: parsed.data.reference_id,
          customerId: parsed.data.customer_id,
        },
      }).then(() => {});
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Submission completed" }),
      headers: responseHeaders,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Fatal error occurred" }),
      headers: responseHeaders,
    };
  }
};

const handler = completionHandler;

export { handler };
