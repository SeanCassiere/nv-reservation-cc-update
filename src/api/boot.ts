import { createHtmlBlobDataUrl } from "../utils/blobUtils";
import { isValueTrue } from "../utils/common";
import { APP_CONSTANTS, COMPAT_KEYS } from "../utils/constants";
import { base64Decode } from "../utils/base64";

import { fetchAgreementByIdOrNumberProcedure } from "./agreementApi";
import { fetchComposeEmailDetails, fetchEmailTemplate, fetchEmailTemplateHtml } from "./emailsApi";
import { fetchReservationByIdOrNumber, RentalSourcedDetails } from "./reservationApi";
import { fetchAdminUser } from "./usersApi";
import { postCustomerCreditCard, postDriverLicenseImage } from "./customerApi";
import { postUploadRentalSignature } from "./digitalSignatureApi";

import type {
  CreditCardStoreType,
  DriversLicenseStoreType,
  RentalSignatureStoreType,
} from "../hooks/stores/useFormStore";
import type { RentalStoreType } from "../hooks/stores/useRuntimeStore";

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

type QueryConfigState = {
  clientId: string | null;
  emailTemplateId: string | null;
  flow: string[];
  fromRentall: boolean;
  successSubmissionScreen?: string;
  showPreSubmitSummary?: boolean;
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
    fromRentall: true,
    showPreSubmitSummary: false,
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
    responseEmailTemplateId: config.emailTemplateId,
    qa: isValueTrue(qaQuery) ? true : false,
    referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
    referenceId: reservationId ? reservationId : agreementId ? agreementId : "",
    flow: config.flow.reduce(normalizeFlowScreens, []),
    fromRentall: config.fromRentall,
    showPreSubmitSummary: config.showPreSubmitSummary,
    successSubmissionScreen: config.successSubmissionScreen,
  };
}

type RandomAll = string | number | null;

export async function initDataFetch(opts: {
  clientId: string;
  responseTemplateId: RandomAll;
  referenceType: string;
  referenceIdentifier: RandomAll;
}) {
  let referenceIdLatest = opts.referenceIdentifier;
  let rentalSourcedDetails: RentalSourcedDetails | null = null;
  let emailTemplateTypeId = 0;
  let emailTemplateCcEmails: string[] = [];
  let fromEmailAddress = "";
  let fromEmailName = "";
  let toEmailAddress = "";
  let responseSubject = "";
  let emailDataBlobUrl: string | null = null;

  // get the admin user account
  const adminUser = await fetchAdminUser(opts.clientId);

  // get the agreement or reservation
  if (opts.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION) {
    const reservation = await fetchReservationByIdOrNumber({
      clientId: opts.clientId,
      referenceId: `${opts.referenceIdentifier}`,
    });
    rentalSourcedDetails = reservation;
    referenceIdLatest = reservation?.referenceId ?? 0;
  } else {
    const agreement = await fetchAgreementByIdOrNumberProcedure({
      clientId: opts.clientId,
      referenceId: `${opts.referenceIdentifier}`,
      adminUserId: adminUser.userID,
    });
    rentalSourcedDetails = agreement;
    referenceIdLatest = agreement?.referenceId ?? 0;
  }

  if (Number(opts.responseTemplateId)) {
    // fetch email template
    const emailTemplate = await fetchEmailTemplate({
      clientId: `${opts.clientId}`,
      templateId: `${opts.responseTemplateId}`,
    });
    if (emailTemplate) {
      emailTemplateTypeId = emailTemplate.templateTypeId;
    }

    // fetch email template cc emails and others
    if (emailTemplateTypeId) {
      const templateDetails = await fetchComposeEmailDetails({
        clientId: `${opts.clientId}`,
        adminUserId: adminUser.userID,
        responseTemplateId: `${opts.responseTemplateId}`,
        referenceType: opts.referenceType,
        referenceId: `${referenceIdLatest}`,
      });
      if (templateDetails) {
        emailTemplateCcEmails = templateDetails.ccEmails;
        fromEmailAddress = templateDetails.fromAddress;
        fromEmailName = templateDetails.mailName;
        toEmailAddress = templateDetails.toAddress;
        responseSubject = templateDetails.selectedTemplate?.subjectLine ?? "";
      }
    }

    // get email body and turn into blob data url
    if (emailTemplateTypeId) {
      const html = await fetchEmailTemplateHtml({
        referenceType: opts.referenceType,
        referenceId: Number(referenceIdLatest),
        subject: responseSubject,
        toEmails: [toEmailAddress],
        ccEmails: emailTemplateCcEmails,
        templateId: Number(opts.responseTemplateId),
        templateTypeId: Number(emailTemplateTypeId),
        clientId: Number(opts.clientId),
        userId: adminUser.userID,
        fromEmail: fromEmailAddress,
      });
      if (html) {
        emailDataBlobUrl = await createHtmlBlobDataUrl(html);
      }
    }
  }

  return {
    adminUserId: adminUser.userID,
    confirmationEmail: Number(opts.responseTemplateId)
      ? {
          templateId: Number(opts.responseTemplateId),
          templateTypeId: emailTemplateTypeId,
          fromEmail: fromEmailAddress,
          fromName: fromEmailName,
          ccList: emailTemplateCcEmails,
          toList: [toEmailAddress].filter((e) => e !== ""),
          subject: responseSubject,
          dataUrl: emailDataBlobUrl,
        }
      : null,
    rental: rentalSourcedDetails,
    referenceId: referenceIdLatest,
  };
}

export async function postFormDataToApi(stores: {
  clientId: string | number;
  customerId: number;
  referenceId: string | number;
  referenceType: string;
  rental: RentalStoreType | null;
  creditCard: CreditCardStoreType;
  driversLicense: DriversLicenseStoreType;
  rentalSignature: RentalSignatureStoreType;
}) {
  const customerId = stores.customerId;
  const clientId = stores.clientId;
  const referenceId = stores.referenceId;
  const referenceType = stores.referenceType;

  const rental = stores.rental;

  const creditCard = stores.creditCard;
  const driversLicense = stores.driversLicense;
  const rentalSignature = stores.rentalSignature;

  const promisesToRun = [];

  if (creditCard.isFilled) {
    promisesToRun.push(postCustomerCreditCard({ customerId, creditCard: creditCard.data }));
  }

  if (driversLicense.isFilled) {
    if (driversLicense.data.frontImageName && driversLicense.data.frontImageUrl) {
      promisesToRun.push(
        postDriverLicenseImage({
          clientId: Number(clientId),
          customerId: `${customerId}`,
          imageUrl: driversLicense.data.frontImageUrl,
          imageName: driversLicense.data.frontImageName,
          side: "Front",
        })
      );
    }
    if (driversLicense.data.backImageName && driversLicense.data.backImageUrl) {
      promisesToRun.push(
        postDriverLicenseImage({
          clientId: Number(clientId),
          customerId: `${customerId}`,
          imageUrl: driversLicense.data.backImageUrl,
          imageName: driversLicense.data.backImageName,
          side: "Back",
        })
      );
    }
  }

  if (rentalSignature.isFilled && rental) {
    promisesToRun.push(
      postUploadRentalSignature({
        customerName: rental.driverName,
        imageUrl: rentalSignature.data.signatureUrl,
        referenceType,
        referenceId: `${referenceId}`,
      })
    );
  }

  return await Promise.all(promisesToRun);
}
