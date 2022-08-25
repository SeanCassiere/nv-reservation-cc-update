import { builder, Handler } from "@netlify/functions";
import axios from "axios";
import { logAction } from "../../helpers/logActions";

import { containsKey, isValueTrue, responseHeaders } from "../../helpers/requestHelpers";

const myHandler: Handler = async (event, context) => {
  const qaQuery = containsKey(event.rawQuery, "qa");
  const isQa = Boolean(isValueTrue(qaQuery));

  const requestParams = new URLSearchParams(event.rawQuery);

  const requestClientIds = requestParams.getAll("client_id");
  const requestBookingTypes = requestParams.getAll("reference_type");
  const requestBookingIds = requestParams.getAll("reference_id");
  const requestIp = event.headers["client-ip"];

  if (requestClientIds.length === 0 || requestBookingTypes.length === 0 || requestBookingIds.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing client_id, reference_type, or reference_id" }),
      headers: responseHeaders,
    };
  }

  const AUTH_URL = isQa ? process.env.QA_V3_AUTH_URL! : process.env.V3_AUTH_URL!;
  const CLIENT_ID = isQa ? process.env.QA_V3_CLIENT_ID! : process.env.V3_CLIENT_ID!;
  const CLIENT_SECRET = isQa ? process.env.QA_V3_CLIENT_SECRET! : process.env.V3_CLIENT_SECRET!;

  const LOGGER_SERVICE_URI = process.env.LOGGER_SERVICE_URI;
  const LOGGER_SERVICE_ID = process.env.LOGGER_SERVICE_ID;

  try {
    const authParams = new URLSearchParams();
    authParams.append("grant_type", "client_credentials");
    authParams.append("client_id", CLIENT_ID);
    authParams.append("client_secret", CLIENT_SECRET);
    authParams.append("scope", "Api");
    const { data } = await axios.post(AUTH_URL, authParams, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (LOGGER_SERVICE_URI && LOGGER_SERVICE_ID) {
      await logAction({ loggerUri: LOGGER_SERVICE_URI, loggerServiceId: LOGGER_SERVICE_ID }, "request-access-token", {
        ip: requestIp,
        environment: isQa ? "qa" : "production",
        data: {
          clientId: requestClientIds[0],
          referenceType: requestBookingTypes[0],
          referenceId: requestBookingIds[0],
        },
      }).then(() => {});
    }

    return { statusCode: 200, body: JSON.stringify(data), headers: responseHeaders };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ error: error }), headers: responseHeaders };
  }
};

const handler = builder(myHandler);

export { handler };
