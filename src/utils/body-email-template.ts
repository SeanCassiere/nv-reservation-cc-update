import type { GlobalDocumentForEmail, OneOffUploadAttachment } from "@/api/emailsApi";

import { APP_CONSTANTS } from "./constants";

export type CreateBodyForEmail = {
  referenceType: string;
  referenceId: number;
  subject: string;
  toEmails: string[];
  ccEmails: string[];
  templateId: number;
  templateTypeId: number;
  fromEmail: string;
  fromName: string;
  userId: number;
  clientId: number;
  emailBody?: string;
  globalDocuments?: GlobalDocumentForEmail[];
  oneOffAttachments?: OneOffUploadAttachment[];
};

export function createBodyForEmail({
  emailBody = "",
  globalDocuments = [],
  oneOffAttachments = [],
  ...opts
}: CreateBodyForEmail) {
  return {
    subject: opts.subject,
    clientId: opts.clientId,
    userId: opts.userId > 0 ? opts.userId : 1,
    agreementId: opts.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? opts.referenceId : null,
    reservationId: opts.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION ? opts.referenceId : null,
    fromEmail: opts.fromEmail,
    fromName: opts.fromName,
    to: opts.toEmails,
    cc: opts.ccEmails,
    emailBody: emailBody,
    sentDate: new Date().toISOString(),
    templateTypeId: opts.templateTypeId,
    templateId: opts.templateId,
    agreementTemplates: [],
    attachmentPath: "",
    attachments: oneOffAttachments,
    creditNoteId: null,
    depositId: 0,
    depositType: "",
    docListForAttach: globalDocuments,
    isUpdate: false,
  };
}
