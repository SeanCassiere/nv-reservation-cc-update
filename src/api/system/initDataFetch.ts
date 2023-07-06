import { createHtmlBlobDataUrl } from "@/utils/blobUtils";
import { APP_CONSTANTS } from "@/utils/constants";

import { fetchAgreementByIdOrNumberProcedure } from "../agreementApi";
import {
  fetchComposeEmailDetails,
  fetchEmailTemplate,
  fetchEmailTemplateHtml,
  fetchGlobalDocumentsForEmailTemplate,
  type GlobalDocumentForEmail,
} from "../emailsApi";
import { fetchReservationByIdOrNumberProcedure, type RentalSourcedDetails } from "../reservationApi";
import { fetchAdminUser } from "../usersApi";

type RandomAll = string | number | null;

export async function initDataFetch(opts: {
  clientId: string;
  adminUserId: number;
  responseTemplateId: RandomAll;
  referenceType: string;
  referenceIdentifier: RandomAll;
  stopEmailGlobalDocuments: boolean;
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
  let emailGlobalDocuments: GlobalDocumentForEmail[] = [];
  let adminUserId = opts.adminUserId;

  // get the admin user account if the predefined admin user id is not set
  if (adminUserId <= 0) {
    const adminUser = await fetchAdminUser(opts.clientId);
    adminUserId = adminUser.userID;
  }

  // get the agreement or reservation
  if (opts.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION) {
    const reservation = await fetchReservationByIdOrNumberProcedure({
      clientId: opts.clientId,
      referenceId: `${opts.referenceIdentifier}`,
    });
    rentalSourcedDetails = reservation;
    referenceIdLatest = reservation?.referenceId ?? 0;
  } else {
    const agreement = await fetchAgreementByIdOrNumberProcedure({
      clientId: opts.clientId,
      referenceId: `${opts.referenceIdentifier}`,
      adminUserId: adminUserId,
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
        adminUserId: adminUserId,
        responseTemplateId: `${opts.responseTemplateId}`,
        referenceType: opts.referenceType,
        referenceId: `${referenceIdLatest}`,
      });
      if (templateDetails) {
        emailTemplateCcEmails = templateDetails.ccEmails;
        fromEmailAddress = templateDetails.fromAddress;
        fromEmailName = templateDetails.mailName ?? templateDetails.fromAddress;
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
        userId: adminUserId,
        fromEmail: fromEmailAddress,
        fromName: fromEmailName,
      });
      if (html) {
        emailDataBlobUrl = await createHtmlBlobDataUrl(html);
      }
    }

    // get global documents
    if (emailTemplateTypeId && opts.stopEmailGlobalDocuments !== true) {
      const documents = await fetchGlobalDocumentsForEmailTemplate({
        clientId: opts.clientId,
        templateId: Number(opts.responseTemplateId),
        templateTypeId: Number(emailTemplateTypeId),
      });
      if (documents && Array.isArray(documents)) {
        emailGlobalDocuments = documents.filter((document) => document.checked);
      }
    }
  }

  return {
    adminUserId: adminUserId,
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
          globalDocuments: emailGlobalDocuments,
        }
      : null,
    rental: rentalSourcedDetails,
    referenceId: referenceIdLatest,
  };
}
