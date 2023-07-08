import { type Handler } from "@netlify/functions";

import { getAccessTokenHandler } from "../../helpers/getAccessTokenHandler";
import { responseHeaders } from "../../helpers/requestHelpers";

const tokenHandler: Handler = async (event) => {
  if (event.httpMethod.toLowerCase() !== "post") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
      headers: responseHeaders,
    };
  }

  const requestIp = event.headers["x-nf-client-connection-ip"] ?? event.headers["client-ip"];

  return await getAccessTokenHandler({
    requestIp,
    body: event.body,
    env: "liquidweb-prod-1",
  });
};

const handler = tokenHandler;

export { handler };
