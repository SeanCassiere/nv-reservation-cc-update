import { APP_CONSTANTS, APP_DEFAULTS } from "./constants";

export type SupportedEnvironments = typeof APP_CONSTANTS.ENV_DEFAULT_PROD | typeof APP_CONSTANTS.ENV_DEFAULT_QA;

export function getEnvironment(attempt?: string): SupportedEnvironments {
  if (!attempt) return APP_DEFAULTS.ENVIRONMENT;

  switch (attempt) {
    case APP_CONSTANTS.ENV_DEFAULT_QA:
      return APP_CONSTANTS.ENV_DEFAULT_QA;
    case APP_CONSTANTS.ENV_DEFAULT_PROD:
      return APP_CONSTANTS.ENV_DEFAULT_PROD;
    default:
      return APP_DEFAULTS.ENVIRONMENT;
  }
}
