import { base64Decode, setHtmlDocumentColorScheme } from "@/utils";
import { getEnvironment } from "@/utils/app-env";
import { APP_CONSTANTS, APP_DEFAULTS, COMPAT_KEYS } from "@/utils/constants";

/**
 * All keys are lowercased to make it easier to compare.
 */
type QueryConfigState = {
  clientid: string | null;
  emailtemplateid: string | null;
  flow: string[];
  userid?: number;
  successsubmissionscreen?: string;
  showpresubmitsummary?: boolean;
  stopemailglobaldocuments?: boolean;
  stopattachingdriverlicensefiles?: boolean;
  colorscheme?: string;
  environment: string;
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

  if (!configQuery) return null;

  let config: QueryConfigState = {
    clientid: null,
    emailtemplateid: null,
    flow: [],
    userid: 0,
    showpresubmitsummary: APP_DEFAULTS.SHOW_PRE_SUBMIT_SUMMARY,
    stopemailglobaldocuments: APP_DEFAULTS.STOP_EMAIL_GLOBAL_DOCUMENTS,
    stopattachingdriverlicensefiles: APP_DEFAULTS.STOP_ATTACHING_DRIVER_LICENSE_FILES,
    colorscheme: APP_DEFAULTS.COLOR_SCHEME,
    environment: APP_DEFAULTS.ENVIRONMENT,
  };

  try {
    const readConfig = JSON.parse(base64Decode(configQuery));
    const configToLowerCaseKeys = Object.entries(readConfig).reduce((prev, [key, value]) => {
      return { ...prev, [key.toLowerCase()]: value };
    }, {});
    config = { ...config, ...configToLowerCaseKeys };
  } catch (error) {
    throw new Error("Could not parse config");
  }

  if (config.colorscheme) {
    setHtmlDocumentColorScheme(config.colorscheme);
  }

  if (!config.clientid) {
    return null;
  }

  return {
    rawConfig: configQuery ?? "",
    clientId: config.clientid,
    userId: config.userid ?? 0,
    responseEmailTemplateId: config.emailtemplateid,
    referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
    referenceId: reservationId ? reservationId : agreementId ? agreementId : "",
    flow: config.flow.reduce(normalizeFlowScreens, []),
    showPreSubmitSummary: config.showpresubmitsummary,
    successSubmissionScreen: normalizeSuccessSubmissionScreen(config.successsubmissionscreen),
    stopEmailGlobalDocuments: config.stopemailglobaldocuments ?? false,
    stopAttachingDriverLicenseFiles: config.stopattachingdriverlicensefiles ?? false,
    colorScheme: config.colorscheme ?? "",
    environment: getEnvironment(config.environment),
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
 * Used to set a default success-submission-screen in the event that one isn't provided in the config.
 *
 * @param configScreenName an optional parameter to represent the screen name.
 * @returns A success-submission-screen.
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
