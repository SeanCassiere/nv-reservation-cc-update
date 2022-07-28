export const APP_CONSTANTS = {
  REF_TYPE_AGREEMENT: "Agreement",
  REF_TYPE_RESERVATION: "Reservation",
  VIEW_DEFAULT_CREDIT_CARD_FORM: "Default/CreditCardForm",
  VIEW_DEFAULT_LICENSE_UPLOAD_FORM: "Default/LicenseUploadForm",
  VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM: "Default/CreditCardAndLicenseUploadForm",
  VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_CONTROLLER: "Default/CreditCardAndLicenseUploadController",
  VIEW_DEFAULT_RENTAL_SIGNATURE_FORM: "Default/RentalSignatureForm",
  VIEW_DEV_SCREEN_1: "Default/Positive",
  VIEW_DEV_SCREEN_2: "Default/Negative",
} as const;

export const ALL_SCREEN_FLOWS = [
  {
    label: "Credit Card Form",
    value: APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_FORM,
  },
  {
    label: "License Upload Form",
    value: APP_CONSTANTS.VIEW_DEFAULT_LICENSE_UPLOAD_FORM,
  },
  {
    label: "Credit Card and License Upload Form",
    value: APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM,
  },
  {
    label: "Rental Signature Form",
    value: APP_CONSTANTS.VIEW_DEFAULT_RENTAL_SIGNATURE_FORM,
  },
  {
    label: "Dev Screen 01",
    value: APP_CONSTANTS.VIEW_DEV_SCREEN_1,
  },
  {
    label: "Dev Screen 02",
    value: APP_CONSTANTS.VIEW_DEV_SCREEN_2,
  },
];
