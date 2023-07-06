import { setHtmlDocumentTheme, base64Decode } from "@/utils";
import { APP_CONSTANTS, COMPAT_KEYS } from "@/utils/constants";
import { isValueTrue } from "@/utils/common";

type QueryConfigState = {
  clientid: string | null;
  emailtemplateid: string | null;
  flow: string[];
  userid?: number;
  successsubmissionscreen?: string;
  showpresubmitsummary?: boolean;
  stopemailglobaldocuments?: boolean;
  stopattachingdriverlicensefiles?: boolean;
  theme?: string;
};

export async function bootUp({ windowQueryString }: { windowQueryString: string }) {
  const query = new URLSearchParams(windowQueryString);

  let findingRefsMissing = false;

  const reservationId = query.get("reservationId");
  const agreementId = query.get("agreementId");

  findingRefsMissing = Boolean(reservationId || agreementId);
  if (!findingRefsMissing) {
    return null;
  }

  const configQuery = query.get("config");
  const qaQuery = query.get("qa");

  let config: QueryConfigState = {
    clientid: null,
    emailtemplateid: null,
    flow: [],
    userid: 0,
    showpresubmitsummary: false,
    stopemailglobaldocuments: false,
    stopattachingdriverlicensefiles: false,
    theme: "",
  };

  if (!configQuery) return null;

  try {
    const readConfig = JSON.parse(base64Decode(configQuery));
    const configToLowerCaseKeys = Object.entries(readConfig).reduce((prev, [key, value]) => {
      return { ...prev, [key.toLowerCase()]: value };
    }, {});
    config = { ...config, ...configToLowerCaseKeys };
  } catch (error) {
    throw new Error("Could not parse config");
  }

  if (config.theme) {
    setHtmlDocumentTheme(config.theme);
  }

  if (!config.clientid) {
    return null;
  }

  return {
    rawConfig: configQuery ?? "",
    clientId: config.clientid,
    userId: config.userid ?? 0,
    responseEmailTemplateId: config.emailtemplateid,
    qa: isValueTrue(qaQuery) ? true : false,
    referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
    referenceId: reservationId ? reservationId : agreementId ? agreementId : "",
    flow: config.flow.reduce(normalizeFlowScreens, []),
    showPreSubmitSummary: config.showpresubmitsummary,
    successSubmissionScreen: normalizeSuccessSubmissionScreen(config.successsubmissionscreen),
    stopEmailGlobalDocuments: config.stopemailglobaldocuments ?? false,
    stopAttachingDriverLicenseFiles: config.stopattachingdriverlicensefiles ?? false,
    theme: config.theme ?? "",
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

/**
 * Used to remedy a mistake made when adding the license and cc upload controller for `ClientID 251`.
 * The config used on their account used the wording of "Controller" instead of "Form".
 *
 * Now it's a way for me silently fix any mistakes I may ship in the naming of the flow screens 😊.
 * @param prev `string[]`
 * @param current `string`
 * @returns An array of usable flow screens. `string[]`
 */
function normalizeSuccessSubmissionScreen(configScreenName?: string) {
  let actualScreenName: string = configScreenName || APP_CONSTANTS.SUCCESS_DEFAULT;

  if (configScreenName) {
    switch (configScreenName) {
      case COMPAT_KEYS.SUCCESS_RENTAL_SUMMARY:
        actualScreenName = APP_CONSTANTS.SUCCESS_RENTAL_CHARGES_SUMMARY;
        break;
      default:
        actualScreenName = configScreenName;
        break;
    }
  }

  return actualScreenName;
}
