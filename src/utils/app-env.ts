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

export function getBaseUrlForEnvironment(environment: string) {
  switch (environment) {
    case APP_CONSTANTS.ENV_DEFAULT_QA:
      return "https://testapi.appnavotar.com";
    case APP_CONSTANTS.ENV_DEFAULT_PROD:
      return "https://api.apprentall.com";
    default:
      return APP_DEFAULTS.BASE_URL;
  }
}

export function getLambdaAuthUrlForEnvironment(environment: string) {
  switch (environment) {
    case APP_CONSTANTS.ENV_DEFAULT_QA:
      return "/api/token-qa";
    case APP_CONSTANTS.ENV_DEFAULT_PROD:
      return "/api/token";
    default:
      return "/api/token";
  }
}
