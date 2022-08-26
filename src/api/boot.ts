import { createHtmlBlobDataUrl } from "../utils/blobUtils";
import { isValueTrue } from "../utils/common";
import { APP_CONSTANTS } from "../utils/constants";
import { fetchAgreementByIdOrNumber } from "./agreementApi";
import { fetchComposeEmailDetails, fetchEmailTemplate, fetchEmailTemplateHtml } from "./emailsApi";
import { fetchReservationByIdOrNumber, RentalSourcedDetails } from "./reservationApi";
import { fetchAdminUser } from "./usersApi";

type QueryConfigState = {
  clientId: string | null;
  emailTemplateId: string | null;
  flow: string[];
  fromRentall: boolean;
  successSubmissionScreen?: string;
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
  };

  if (!configQuery) return null;

  try {
    const readConfig = JSON.parse(Buffer.from(configQuery, "base64").toString("ascii"));
    config = { ...config, ...readConfig };
  } catch (error) {
    throw new Error("Could not parse config");
  }

  if (!config.clientId || !config.emailTemplateId) {
    return null;
  }

  return {
    rawConfig: configQuery ?? "",
    clientId: config.clientId,
    responseEmailTemplateId: config.emailTemplateId,
    qa: isValueTrue(qaQuery) ? true : false,
    referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
    referenceId: reservationId ? reservationId : agreementId ? agreementId : "",
    flow: config.flow,
    fromRentall: config.fromRentall,
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
  } else {
    const agreement = await fetchAgreementByIdOrNumber({
      clientId: opts.clientId,
      referenceId: `${opts.referenceIdentifier}`,
      adminUserId: adminUser.userID,
    });
    rentalSourcedDetails = agreement;
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
        referenceId: `${opts.referenceIdentifier}`,
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
        referenceId: Number(opts.referenceIdentifier),
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
    confirmationEmail: {
      templateId: Number(opts.responseTemplateId),
      templateTypeId: emailTemplateTypeId,
      fromAddress: fromEmailAddress,
      fromName: fromEmailName,
      ccList: emailTemplateCcEmails,
      toList: [toEmailAddress],
      subject: responseSubject,
      dataUrl: emailDataBlobUrl,
    },
    rental: rentalSourcedDetails,
  };
}
