import { DevConfigObject } from "./DeveloperDebugMenu";
import { APP_CONSTANTS } from "../../utils/constants";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { useConfigStore } from "../../hooks/stores/useConfigStore";
import { base64Encode } from "../../utils/base64";

export function devConfigToQueryUrl(config: DevConfigObject) {
  const params = new URLSearchParams();

  if (config.qa) params.append("qa", "true");

  if (config.dev) params.append("dev", "true");

  // setting agreementId or reservationId
  if (config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT) {
    params.append("agreementId", `${config.referenceId}`);
  } else {
    params.append("reservationId", `${config.referenceId}`);
  }

  // setting lang
  params.append("lang", `${config.lang}`);

  // setting the config
  const hashObj = {
    clientId: Number(config.clientId) ?? Number(useRuntimeStore.getState().clientId),
    emailTemplateId: Number(config.emailTemplateId) ?? Number(useRuntimeStore.getState().responseTemplateId),
    flow: config.flow ?? useConfigStore.getState().flow,
    fromRentall: config.fromRentall !== undefined ? config.fromRentall : useConfigStore.getState().fromRentall,
    successSubmissionScreen: config.successSubmissionScreen ?? useConfigStore.getState().successSubmissionScreen,
    showPreSubmitSummary: config.showPreSubmitSummary ?? useConfigStore.getState().showPreSubmitSummary,
  };

  let objJsonStr = JSON.stringify(hashObj);
  let objJsonB64 = base64Encode(objJsonStr);

  params.append("config", objJsonB64);

  return params.toString();
}
