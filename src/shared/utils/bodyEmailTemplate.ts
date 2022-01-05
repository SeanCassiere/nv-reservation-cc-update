import { ConfigSliceState } from "../redux/slices/config";
import { IReservationSliceState } from "../redux/slices/retrievedDetails";

interface Props {
	config: ConfigSliceState;
	reservationDetails: IReservationSliceState;
	emailBody?: string;
}

export function bodyEmailTemplate({ reservationDetails, config, emailBody = "" }: Props) {
	const currentDate = new Date();
	const currentISODate = currentDate.toISOString();

	return {
		agreementId: null,
		agreementTemplates: [],
		attachmentPath: "",
		attachments: [],
		cc: [...reservationDetails.ccEmails],
		clientId: config.clientId,
		creditNoteId: null,
		depositId: 0,
		depositType: "",
		docListForAttach: [],
		emailBody: emailBody,
		fromEmail: reservationDetails.locationEmail,
		isUpdate: false,
		reservationId: reservationDetails.reservationId,
		sentDate: currentISODate,
		subject: reservationDetails.responseTemplateSubject,
		templateId: config.responseTemplateId,
		templateTypeId: reservationDetails.responseTemplateTypeId,
		to: [reservationDetails.customerEmail],
		userId: 1,
	};
}
