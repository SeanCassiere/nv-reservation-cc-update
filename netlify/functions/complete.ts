import { type Handler } from "@netlify/functions";

import { formatZodErrors, ResponseHeaders, SubmissionCompletedRequestSchema } from "../../helpers/common";
import { LoggingClient } from "../../helpers/log.service";

const completionHandler: Handler = async (event) => {
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
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing body" }),
        headers: ResponseHeaders,
      };
    }

    const body = JSON.parse(event.body);
    const parsed = SubmissionCompletedRequestSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: formatZodErrors(parsed.error.issues) }),
        headers: ResponseHeaders,
      };
    }

    logger
      .save(
        "submitted-details",
        {
          status: parsed.data.status,
          clientId: parsed.data.client_id,
          referenceType: parsed.data.reference_type,
          referenceId: parsed.data.reference_id,
          customerId: parsed.data.customer_id,
        },
        { appEnvironment: parsed.data.environment, lookup: parsed.data.client_id, ip: requestIp },
      )
      .then(() => {});

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Submission completed" }),
      headers: ResponseHeaders,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Fatal error occurred" }),
      headers: ResponseHeaders,
    };
  }
};

const handler = completionHandler;

export { handler };
