import { ZodError } from "zod";

import { formatZodErrors, ResponseHeaders, SubmissionCompletedRequestSchema } from "../helpers/common";
import { LoggingClient } from "../helpers/log.service";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: ResponseHeaders,
    });
  }

  let parentEnvironment = "undetermined-environment";
  let parentClientId = "undetermined-client-id";
  let parentReferenceId = "undetermined-reference-id";
  let parentReferenceType = "undetermined-reference-type";

  const realIp = request.headers.get("x-real-ip");

  const requestIp = realIp ?? "no-ip-address";
  const logger = LoggingClient.getLoggingService();

  try {
    if (!request.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing body" }),
        headers: ResponseHeaders,
      };
    }

    const body = request.json();
    const parsed = SubmissionCompletedRequestSchema.safeParse(body);

    if (!parsed.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: formatZodErrors(parsed.error.issues) }),
        headers: ResponseHeaders,
      };
    }

    parentEnvironment = parsed.data.environment;
    parentClientId = parsed.data.client_id;
    parentReferenceId = parsed.data.reference_id;
    parentReferenceType = parsed.data.reference_type;

    await logger
      .save(
        "info",
        "submitted-details-success",
        {
          status: parsed.data.status,
          clientId: parsed.data.client_id,
          referenceType: parsed.data.reference_type,
          referenceId: parsed.data.reference_id,
          customerId: parsed.data.customer_id,
          "x-vercel-id": request.headers.get("x-vercel-id") || "no-vercel-id",
        },
        { appEnvironment: parsed.data.environment, lookup: parsed.data.client_id, ip: requestIp },
      )
      .then((data) => {
        console.info("Saved log", JSON.stringify(data));
      });

    return new Response(JSON.stringify({ success: true, message: "Submission completed" }), {
      status: 200,
      headers: ResponseHeaders,
    });
  } catch (error) {
    let errorMessage = "Something went wrong at api/complete";
    let errorType = "Error";

    if (error instanceof ZodError) {
      errorMessage = "Validation error with zod";
      errorType = "ZodError";
    } else {
      errorMessage =
        error instanceof Error
          ? error?.message || "Something went wrong at api/complete"
          : "Something went wrong at api/complete";
    }

    await logger.save(
      "error",
      "submitted-details-fail",
      { errorType, errorMessage },
      { ip: requestIp, appEnvironment: parentEnvironment, lookup: "error" },
    );

    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Fatal error occurred" }),
      {
        status: 500,
        headers: ResponseHeaders,
      },
    );
  }
}
