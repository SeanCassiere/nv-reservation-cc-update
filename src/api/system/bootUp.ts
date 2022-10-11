import { isValueTrue } from "../../utils/common";
import { APP_CONSTANTS, COMPAT_KEYS } from "../../utils/constants";
import { base64Decode } from "../../utils/base64";

type QueryConfigState = {
  clientId: string | null;
  emailTemplateId: string | null;
  flow: string[];
  userId?: number;
  fromRentall: boolean;
  successSubmissionScreen?: string;
  showPreSubmitSummary?: boolean;
  stopEmailGlobalDocuments?: boolean;
  stopAttachingDriverLicenseFiles?: boolean;
};

export async function bootUp({ windowQueryString }: { windowQueryString: string }) {
  const query = new URLSearchParams(windowQueryString);

  let findingRefsMissing = false;

  let reservationId = query.get("reservationId");
  let agreementId = query.get("agreementId");

  findingRefsMissing = Boolean(reservationId || agreementId);
  if (!findingRefsMissing) {
    return null;
  }

  const configQuery = query.get("config");
  const qaQuery = query.get("qa");

  let config: QueryConfigState = {
    clientId: null,
    emailTemplateId: null,
    flow: [],
    userId: 0,
    fromRentall: true,
    showPreSubmitSummary: false,
    stopEmailGlobalDocuments: false,
    stopAttachingDriverLicenseFiles: false,
  };

  if (!configQuery) return null;

  try {
    const readConfig = JSON.parse(base64Decode(configQuery));
    config = { ...config, ...readConfig };
  } catch (error) {
    throw new Error("Could not parse config");
  }

  if (!config.clientId) {
    return null;
  }

  return {
    rawConfig: configQuery ?? "",
    clientId: config.clientId,
    userId: config.userId ?? 0,
    responseEmailTemplateId: config.emailTemplateId,
    qa: isValueTrue(qaQuery) ? true : false,
    referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
    referenceId: reservationId ? reservationId : agreementId ? agreementId : "",
    flow: config.flow.reduce(normalizeFlowScreens, []),
    fromRentall: config.fromRentall,
    showPreSubmitSummary: config.showPreSubmitSummary,
    successSubmissionScreen: config.successSubmissionScreen,
    stopEmailGlobalDocuments: config.stopEmailGlobalDocuments ?? false,
    stopAttachingDriverLicenseFiles: config.stopAttachingDriverLicenseFiles ?? false,
  };
}

/**
 * Used to remedy a mistake made when adding the license and cc upload controller for `ClientID 251`.
 * The config used on their account used the wording of "Controller" instead of "Form".
 *
 * Now it's a way for me silently fix any mistakes I may ship in the naming of the flow screens 😊.
 * @param prev `string[]`
 * @param current `string`
 * @returns An array of usable flow screens. `string[]`
 */
function normalizeFlowScreens(prev: string[], current: string) {
  let nowScreen = current;
  if (
    nowScreen === COMPAT_KEYS.DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_CONTROLLER ||
    nowScreen === COMPAT_KEYS.DEFAULT_LICENSE_UPLOAD_FORM
  ) {
    nowScreen = APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM;
  }
  if (nowScreen === COMPAT_KEYS.DEFAULT_CREDIT_CARD_FORM) {
    nowScreen = APP_CONSTANTS.FLOW_CREDIT_CARD_FORM;
  }
  if (nowScreen === COMPAT_KEYS.DEFAULT_RENTAL_CHARGES_FORM) {
    nowScreen = APP_CONSTANTS.FLOW_RENTAL_CHARGES_FORM;
  }
  if (nowScreen === COMPAT_KEYS.DEFAULT_RENTAL_SIGNATURE_FORM) {
    nowScreen = APP_CONSTANTS.FLOW_RENTAL_SIGNATURE_FORM;
  }
  if (nowScreen === COMPAT_KEYS.DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM) {
    nowScreen = APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM;
  }

  prev.push(nowScreen);
  return prev;
}