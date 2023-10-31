export const REPO_URL = "https://github.com/SeanCassiere/nv-reservation-cc-update";

export const SuccessImgUri = "/assets/undraw_make_it_rain_iwk4.svg";

export const PACKAGE_VERSION = import.meta.env.PACKAGE_VERSION ?? "0.0.0";

export const APP_CONSTANTS = {
  REF_TYPE_AGREEMENT: "Agreement",
  REF_TYPE_RESERVATION: "Reservation",

  FLOW_CREDIT_CARD_FORM: "CreditCardForm",
  FLOW_DEFAULT_LICENSE_UPLOAD_FORM: "LicenseUploadForm",
  FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM: "CreditCardAndLicenseUploadForm",
  FLOW_RENTAL_SIGNATURE_FORM: "RentalSignatureForm",
  FLOW_RENTAL_CHARGES_FORM: "RentalSummaryForm",
  FLOW_DEV_SCREEN_1: "DevScreen1",
  FLOW_DEV_SCREEN_2: "DevScreen2",
  FLOW_FORMS_SUMMARY: "FormSummary",

  SUCCESS_DEFAULT: "SuccessSubmission",
  SUCCESS_RENTAL_CHARGES_SUMMARY: "SuccessRentalChargesSummary",
  SUCCESS_SUBMITTED_FORMS_SUMMARY: "SuccessSubmittedFormsSummary",
  SUCCESS_SUBMITTED_FORMS_WITH_RENTAL_CHARGES_SUMMARY: "SuccessSubmittedFormsWithRentalChargesSummary",
  SUCCESS_TEST: "test/test",

  COLOR_SCHEME_DEFAULT_CLASS: "default", // this value should never be saved with the config
  COLOR_SCHEME_DARK_CLASS: "dark",
  COLOR_SCHEME_GREEN_CLASS: "green",

  ENV_DEFAULT_PROD: "liquidweb-prod-1",
  ENV_DEFAULT_QA: "liquidweb-qa-1",
} as const;

export const ALL_COLOR_SCHEME_CLASSNAMES = [
  APP_CONSTANTS.COLOR_SCHEME_DEFAULT_CLASS,
  APP_CONSTANTS.COLOR_SCHEME_DARK_CLASS,
  APP_CONSTANTS.COLOR_SCHEME_GREEN_CLASS,
];

export const APP_DEFAULTS = {
  COLOR_SCHEME: APP_CONSTANTS.COLOR_SCHEME_DEFAULT_CLASS,

  ENVIRONMENT: APP_CONSTANTS.ENV_DEFAULT_PROD,
  BASE_URL: "https://api.apprentall.com" as const,

  FLOW_SCREENS: [APP_CONSTANTS.FLOW_CREDIT_CARD_FORM], // the screens to show the user

  SHOW_PRE_SUBMIT_SUMMARY: false, // show the user a summary of their submission before they submit
  SUCCESS_SUBMISSION_SCREEN: APP_CONSTANTS.SUCCESS_DEFAULT, // shown once the user has submitted all forms

  STOP_EMAIL_GLOBAL_DOCUMENTS: false, // for the response email
  STOP_ATTACHING_DRIVER_LICENSE_FILES: false, // for the response email
};

export const COMPAT_KEYS = {
  DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM: "Default/CreditCardAndLicenseUploadForm",
  DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_CONTROLLER: "Default/CreditCardAndLicenseUploadController",
  DEFAULT_LICENSE_UPLOAD_FORM: "Default/LicenseUploadForm",
  DEFAULT_CREDIT_CARD_FORM: "Default/CreditCardForm",
  DEFAULT_RENTAL_CHARGES_FORM: "Default/RentalSummaryForm",
  DEFAULT_RENTAL_SIGNATURE_FORM: "Default/RentalSignatureForm",

  SUCCESS_RENTAL_SUMMARY: "SuccessRentalSummary",
} as const;

export const ALL_SCREEN_FLOWS = [
  {
    label: APP_CONSTANTS.FLOW_CREDIT_CARD_FORM,
    value: APP_CONSTANTS.FLOW_CREDIT_CARD_FORM,
  },
  {
    label: APP_CONSTANTS.FLOW_DEFAULT_LICENSE_UPLOAD_FORM,
    value: APP_CONSTANTS.FLOW_DEFAULT_LICENSE_UPLOAD_FORM,
  },
  {
    label: APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM,
    value: APP_CONSTANTS.FLOW_CREDIT_CARD_LICENSE_UPLOAD_FORM,
  },
  {
    label: APP_CONSTANTS.FLOW_RENTAL_SIGNATURE_FORM,
    value: APP_CONSTANTS.FLOW_RENTAL_SIGNATURE_FORM,
  },
  {
    label: APP_CONSTANTS.FLOW_RENTAL_CHARGES_FORM,
    value: APP_CONSTANTS.FLOW_RENTAL_CHARGES_FORM,
  },
  {
    label: APP_CONSTANTS.FLOW_DEV_SCREEN_1,
    value: APP_CONSTANTS.FLOW_DEV_SCREEN_1,
  },
  {
    label: APP_CONSTANTS.FLOW_DEV_SCREEN_2,
    value: APP_CONSTANTS.FLOW_DEV_SCREEN_2,
  },
];

export const ALL_SUCCESS_SCREENS = [
  {
    label: APP_CONSTANTS.SUCCESS_TEST,
    value: APP_CONSTANTS.SUCCESS_TEST,
  },
  {
    label: APP_CONSTANTS.SUCCESS_DEFAULT,
    value: APP_CONSTANTS.SUCCESS_DEFAULT,
  },
  {
    label: APP_CONSTANTS.SUCCESS_RENTAL_CHARGES_SUMMARY,
    value: APP_CONSTANTS.SUCCESS_RENTAL_CHARGES_SUMMARY,
  },
  {
    label: APP_CONSTANTS.SUCCESS_SUBMITTED_FORMS_SUMMARY,
    value: APP_CONSTANTS.SUCCESS_SUBMITTED_FORMS_SUMMARY,
  },
  {
    label: APP_CONSTANTS.SUCCESS_SUBMITTED_FORMS_WITH_RENTAL_CHARGES_SUMMARY,
    value: APP_CONSTANTS.SUCCESS_SUBMITTED_FORMS_WITH_RENTAL_CHARGES_SUMMARY,
  },
];
