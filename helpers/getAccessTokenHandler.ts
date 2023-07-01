import axios from "axios";
import { logAction } from "./logActions";
import { responseHeaders, tokenRequestSchema } from "./requestHelpers";

type GetAccessTokenOptions = {
  qa: boolean;
  requestIp?: string | null;
  body: string | null;
};
export async function getAccessTokenHandler(opts: GetAccessTokenOptions) {
  const AUTH_URL = opts.qa ? process.env.QA_V3_AUTH_URL! : process.env.V3_AUTH_URL!;
  const CLIENT_ID = opts.qa ? process.env.QA_V3_CLIENT_ID! : process.env.V3_CLIENT_ID!;
  const CLIENT_SECRET = opts.qa ? process.env.QA_V3_CLIENT_SECRET! : process.env.V3_CLIENT_SECRET!;

  const LOGGER_SERVICE_URI = process.env.LOGGER_SERVICE_URI;
  const LOGGER_SERVICE_ID = process.env.LOGGER_SERVICE_ID;

  if (!AUTH_URL || !CLIENT_ID || !CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing AUTH_URL, CLIENT_ID, or CLIENT_SECRET" }),
      headers: responseHeaders,
    };
  }

  try {
    if (!opts.body) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing body" }), headers: responseHeaders };
    }
    const body = JSON.parse(opts.body);
    const parsed = tokenRequestSchema.parse(body);

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("scope", "Api");

    const { data } = await axios.post(AUTH_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (LOGGER_SERVICE_URI && LOGGER_SERVICE_ID && opts.requestIp) {
      await logAction({ loggerUri: LOGGER_SERVICE_URI, loggerServiceId: LOGGER_SERVICE_ID }, "request-access-token", {
        ip: opts.requestIp,
        environment: opts.qa ? "qa" : "production",
        lookupFilterValue: parsed.client_id,
        data: {
          clientId: parsed.client_id,
          referenceType: parsed.reference_type,
          referenceId: parsed.reference_id,
        },
      }).then(() => {});
    }

    return { statusCode: 200, body: JSON.stringify(data), headers: responseHeaders };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ error: error }), headers: responseHeaders };
  }
}
