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

  const urlParams = new URL(request.url).searchParams;
  const query = Object.fromEntries(urlParams);
  const cookies = request.headers.get("cookie");

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

    const authService = AuthorizationClient.getAuthService(parsed.data.environment);
    const authData = await authService.getAccessToken();

    await logger
      .save(
        "request-access-token",
        {
          clientId: parsed.data.client_id,
          referenceType: parsed.data.reference_type,
          referenceId: parsed.data.reference_id,
          "x-vercel-id": request.headers.get("x-vercel-id") ?? "no-vercel-id",
        },
        {
          appEnvironment: parsed.data.environment,
          lookup: parsed.data.client_id,
          ip: requestIp,
        },
      )
      .then(() => {});

    return new Response(JSON.stringify(authData), {
      status: 200,
      headers: ResponseHeaders,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Fatal error occurred" }), {
      status: 500,
      headers: ResponseHeaders,
    });
  }
}
