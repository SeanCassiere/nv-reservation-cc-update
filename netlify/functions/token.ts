import { builder, Handler } from "@netlify/functions";
import axios from "axios";

const containsKey = (rawQueryString: string, key: string): boolean => {
  return rawQueryString.indexOf(key) !== -1;
};

const isValueTrue = (value: string | undefined | null | boolean): boolean => {
  if (!value) return false;
  return value &&
    ((typeof value === "string" && value.toLowerCase() === "true") ||
      (typeof value === "string" && value === "1") ||
      value === true)
    ? true
    : false;
};

const responseHeaders = {
  "Content-Type": "application/json",
};

const myHandler: Handler = async (event, context) => {
  const qaQuery = containsKey(event.rawQuery, "qa");
  const isQa = Boolean(isValueTrue(qaQuery));

  const url = isQa ? process.env.QA_V3_AUTH_URL! : process.env.V3_AUTH_URL!;
  const clientId = isQa ? process.env.QA_V3_CLIENT_ID! : process.env.V3_CLIENT_ID!;
  const clientSecret = isQa ? process.env.QA_V3_CLIENT_SECRET! : process.env.V3_CLIENT_SECRET!;

  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("scope", "Api");
    const { data } = await axios.post(url, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return { statusCode: 200, body: JSON.stringify(data), headers: responseHeaders };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: JSON.stringify({ error: error }), headers: responseHeaders };
  }
};

const handler = builder(myHandler);

export { handler };
