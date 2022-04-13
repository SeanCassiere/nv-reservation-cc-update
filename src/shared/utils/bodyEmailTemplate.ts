import { ConfigSliceState } from "../redux/slices/config/slice";
import { IRetrievedDetailsSliceState } from "../redux/slices/retrievedDetails/slice";

interface Props {
	config: ConfigSliceState;
	reservationDetails: IRetrievedDetailsSliceState;
	emailBody?: string;
}

export function bodyEmailTemplate({ reservationDetails, config, emailBody = "" }: Props) {
	const currentDate = new Date();
	const currentISODate = currentDate.toISOString();

	console.log({ m: "hello world", r: reservationDetails.referenceId });

	return {
		subject: reservationDetails.responseTemplateSubject,
		clientId: config.clientId,
		userId: 1,
		agreementId: config.referenceType === "Agreement" ? reservationDetails.referenceId : null,
		reservationId: config.referenceType === "Reservation" ? reservationDetails.referenceId : null,
		fromEmail: reservationDetails.locationEmail,
		to: [reservationDetails.customerEmail],
		cc: [...reservationDetails.ccEmails],
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
