import { builder, Handler } from "@netlify/functions";

import { logAction } from "../../helpers/logActions";
import { containsKey, isValueTrue, responseHeaders } from "../../helpers/requestHelpers";

const completionHandler: Handler = async (event) => {
  const qaQuery = containsKey(event.rawQuery, "qa");
  const isQa = Boolean(isValueTrue(qaQuery));

  const requestParams = new URLSearchParams(event.rawQuery);

  const requestClientIds = requestParams.getAll("client_id");
  const requestBookingTypes = requestParams.getAll("reference_type");
  const requestBookingIds = requestParams.getAll("reference_id");
  const requestCustomerIds = requestParams.getAll("customer_id");
  const requestStatusValues = requestParams.getAll("status");
  const requestIp = event.headers["x-nf-client-connection-ip"] ?? event.headers["client-ip"];

  if (
    requestClientIds.length === 0 ||
    requestBookingTypes.length === 0 ||
    requestBookingIds.length === 0 ||
    requestCustomerIds.length === 0 ||
    requestStatusValues.length === 0
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        message: "Missing client_id, reference_type, reference_id, customer_id, or status",
      }),
      headers: responseHeaders,
    };
  }

  const LOGGER_SERVICE_URI = process.env.LOGGER_SERVICE_URI;
  const LOGGER_SERVICE_ID = process.env.LOGGER_SERVICE_ID;

  if (LOGGER_SERVICE_URI && LOGGER_SERVICE_ID) {
    await logAction({ loggerUri: LOGGER_SERVICE_URI, loggerServiceId: LOGGER_SERVICE_ID }, "submitted-details", {
      ip: requestIp,
      environment: isQa ? "qa" : "production",
      data: {
        status: requestStatusValues[0],
        clientId: requestClientIds[0],
        referenceType: requestBookingTypes[0],
        referenceId: requestBookingIds[0],
        customerId: requestCustomerIds[0],
      },
    }).then(() => {});
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: "Submission completed" }),
    headers: responseHeaders,
  };
};

const handler = builder(completionHandler);

export { handler };
