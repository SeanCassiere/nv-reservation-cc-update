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
