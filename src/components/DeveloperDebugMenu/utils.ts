import { APP_CONSTANTS } from "../../utils/constants";
import { DevConfigObject, initialConfigState } from "./DeveloperDebugMenu";

export function devConfigToQueryUrl(config: DevConfigObject) {
  let queryString = "?";

  // use qa server
  if (config.qa) {
    queryString += "qa=true";
  }

  // open dev menu by default
  if (config.dev) {
    if (config.qa) {
      queryString += "&";
    }
    queryString += "dev=true";
  }

  // based on qa or dev flags, append & into the query string
  if (config.qa || config.dev) {
    queryString += "&";
  }

  // setting agreementId or reservationId
  if (config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT) {
    queryString += `agreementId=${config.referenceId}`;
  } else {
    queryString += `reservationId=${config.referenceId}`;
  }

  // setting lang
  queryString += `&lang=${config.lang}`;

  // setting the config
  const hashObj = {
    clientId: Number(config.clientId) ?? Number(initialConfigState.clientId),
    emailTemplateId: Number(config.emailTemplateId) ?? Number(initialConfigState.emailTemplateId),
    flow: config.flow ?? initialConfigState.flow,
    fromRentall: config.fromRentall !== undefined ? config.fromRentall : initialConfigState.fromRentall,
    successSubmissionScreen: config.successSubmissionScreen ?? initialConfigState.successSubmissionScreen,
  };

  let objJsonStr = JSON.stringify(hashObj);
  let objJsonB64 = btoa(objJsonStr);
  queryString += "&config=" + objJsonB64;

  const location = window.location.href.split("?")[0];
  const newUrl = `${location}${queryString}`;

  return newUrl;
}
