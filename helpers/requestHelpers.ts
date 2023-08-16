import type { SupportedEnvironments } from "./common";

export function getAuthProperties(environment: SupportedEnvironments) {
  switch (environment) {
    case "liquidweb-prod-1":
      const AUTH_URL = "https://auth.appnavotar.com/connect/token";
      const CLIENT_ID = process.env.V3_CLIENT_ID;
      const CLIENT_SECRET = process.env.V3_CLIENT_SECRET;
      const BASE_URL = "https://api.apprentall.com";
      if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error(`Missing V3_CLIENT_ID, or V3_CLIENT_SECRET for ${environment} environment`);
      }
      return {
        AUTH_URL,
        CLIENT_ID,
        CLIENT_SECRET,
        BASE_URL,
      } as const;
    case "liquidweb-qa-1":
      const QA_AUTH_URL = "https://testauth.appnavotar.com/connect/token";
      const QA_CLIENT_ID = process.env.QA_V3_CLIENT_ID;
      const QA_CLIENT_SECRET = process.env.QA_V3_CLIENT_SECRET;
      const QA_BASE_URL = "https://testapi.appnavotar.com";
      if (!QA_CLIENT_ID || !QA_CLIENT_SECRET) {
        throw new Error(`Missing QA_V3_CLIENT_ID, or QA_V3_CLIENT_SECRET for ${environment} environment`);
      }
      return {
        AUTH_URL: QA_AUTH_URL,
        CLIENT_ID: QA_CLIENT_ID,
        CLIENT_SECRET: QA_CLIENT_SECRET,
        BASE_URL: QA_BASE_URL,
      } as const;
    default:
      throw new Error("Invalid environment");
  }
}
