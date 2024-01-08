import { ZodError } from "zod";

import { AuthorizationClient } from "../helpers/auth.service";
import { formatZodErrors, GetTokenRequestSchema, ResponseHeaders } from "../helpers/common";
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
      return new Response(JSON.stringify({ error: "Missing body" }), {
        status: 400,
        headers: ResponseHeaders,
      });
    }

    const body = await request.json();
    const parsed = GetTokenRequestSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: formatZodErrors(parsed.error.issues) }), {
        status: 400,
        headers: ResponseHeaders,
      });
    }

    parentEnvironment = parsed.data.environment;
    parentClientId = parsed.data.client_id;
    parentReferenceId = parsed.data.reference_id;
    parentReferenceType = parsed.data.reference_type;

    const authService = AuthorizationClient.getAuthService(parsed.data.environment);
    const authData = await authService.getAccessToken();

    await logger.save(
      "info",
      "request-access-token-success",
      {
        clientId: parsed.data.client_id,
        referenceType: parsed.data.reference_type,
        referenceId: parsed.data.reference_id,
        "x-vercel-id": request.headers.get("x-vercel-id") || "no-vercel-id",
      },
      {
        appEnvironment: parsed.data.environment,
        lookup: parsed.data.client_id,
        ip: requestIp,
      },
    );

    return new Response(JSON.stringify(authData), {
      status: 200,
      headers: ResponseHeaders,
    });
  } catch (error) {
    let errorMessage = "Something went wrong at api/token";
    let errorType = "Error";

    if (error instanceof ZodError) {
      errorMessage = "Validation error with zod";
      errorType = "ZodError";
    } else {
      errorMessage =
        error instanceof Error
          ? error?.message || "Something went wrong at api/token"
          : "Something went wrong at api/token";
    }

    await logger.save(
      "error",
      "request-access-token-fail",
      { errorType, errorMessage },
      { ip: requestIp, appEnvironment: parentEnvironment, lookup: "error" },
    );

    return new Response(JSON.stringify({ error: errorMessage, error_type: errorType }), {
      status: 500,
      headers: ResponseHeaders,
    });
  }
}
