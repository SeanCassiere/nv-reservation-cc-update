import { ConfigSliceState } from "../redux/slices/config";
import { IReservationSliceState } from "../redux/slices/reservation";

interface Props {
	reservationDetails: IReservationSliceState;
	config: ConfigSliceState;
}

export function bodySendEmail({ reservationDetails, config }: Props) {
	const postBody = {
		clientId: config.clientId,
		templateTypeId: 2,
		purposeId: reservationDetails.reservationId,
		agreementId: 0,
		reservationId: reservationDetails.reservationId,
		templateId: config.responseTemplateId,
	};

	return postBody;
}
