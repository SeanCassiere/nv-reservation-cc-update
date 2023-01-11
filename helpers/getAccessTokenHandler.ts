import axios from "axios";
import { logAction } from "./logActions";
import { responseHeaders } from "./requestHelpers";

type GetAccessTokenOptions = {
  qa: boolean;
  requestIp?: string | null;
  clientIdSet: string[];
  referenceTypeSet: string[];
  referenceIdSet: string[];
};
export async function getAccessTokenHandler(opts: GetAccessTokenOptions) {
  if (opts.clientIdSet.length === 0 || opts.referenceTypeSet.length === 0 || opts.referenceIdSet.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing client_id, reference_type, or reference_id" }),
      headers: responseHeaders,
    };
  }

  const AUTH_URL = opts.qa ? process.env.QA_V3_AUTH_URL! : process.env.V3_AUTH_URL!;
  const CLIENT_ID = opts.qa ? process.env.QA_V3_CLIENT_ID! : process.env.V3_CLIENT_ID!;
  const CLIENT_SECRET = opts.qa ? process.env.QA_V3_CLIENT_SECRET! : process.env.V3_CLIENT_SECRET!;

  const LOGGER_SERVICE_URI = process.env.LOGGER_SERVICE_URI;
  const LOGGER_SERVICE_ID = process.env.LOGGER_SERVICE_ID;

  try {
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
        lookupFilterValue: opts.clientIdSet[0],
        data: {
          clientId: opts.clientIdSet[0],
          referenceType: opts.referenceTypeSet[0],
          referenceId: opts.referenceIdSet[0],
        },
      }).then(() => {});
    }

    return { statusCode: 200, body: JSON.stringify(data), headers: responseHeaders };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ error: error }), headers: responseHeaders };
  }
}
