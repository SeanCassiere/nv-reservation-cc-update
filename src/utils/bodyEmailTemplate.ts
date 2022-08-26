import { ConfigSliceState } from "../redux/slices/config/slice";
import { IRetrievedDetailsSliceState } from "../redux/slices/retrievedDetails/slice";
import { APP_CONSTANTS } from "./constants";

interface Props {
  config: ConfigSliceState;
  reservationDetails: IRetrievedDetailsSliceState;
  emailBody?: string;
}

export function bodyEmailTemplate({ reservationDetails, config, emailBody = "" }: Props) {
  const currentDate = new Date();
  const currentISODate = currentDate.toISOString();

  return {
    subject: reservationDetails.responseTemplateSubject,
    clientId: config.clientId,
    userId: reservationDetails.adminUserId > 0 ? reservationDetails.adminUserId : 1,
    agreementId: config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? reservationDetails.referenceId : null,
    reservationId: config.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION ? reservationDetails.referenceId : null,
    fromEmail: reservationDetails.data.locationEmail,
    to: [reservationDetails.data.customerEmail],
    cc: [...reservationDetails.responseEmailsToCc],
    emailBody: emailBody,
    sentDate: currentISODate,
    templateTypeId: reservationDetails.responseTemplateTypeId,
    templateId: config.responseTemplateId,
    //
    agreementTemplates: [],
    attachmentPath: "",
    attachments: [],
    creditNoteId: null,
    depositId: 0,
    depositType: "",
    docListForAttach: [],
    isUpdate: false,
  };
}

export type CreateBodyForEmail = {
  referenceType: string;
  referenceId: number;
  subject: string;
  toEmails: string[];
  ccEmails: string[];
  templateId: number;
  templateTypeId: number;
  fromEmail: string;
  userId: number;
  clientId: number;
  emailBody?: string;
};

export function createBodyForEmail({ emailBody = "", ...opts }: CreateBodyForEmail) {
  return {
    subject: opts.subject,
    clientId: opts.clientId,
    userId: opts.userId > 0 ? opts.userId : 1,
    agreementId: opts.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? opts.referenceId : null,
    reservationId: opts.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION ? opts.referenceId : null,
    fromEmail: opts.fromEmail,
    to: opts.toEmails,
    cc: opts.ccEmails,
    emailBody: emailBody,
    sentDate: new Date().toISOString(),
    templateTypeId: opts.templateTypeId,
    templateId: opts.templateId,
    //
    agreementTemplates: [],
    attachmentPath: "",
    attachments: [],
    creditNoteId: null,
    depositId: 0,
    depositType: "",
    docListForAttach: [],
    isUpdate: false,
  };
}
