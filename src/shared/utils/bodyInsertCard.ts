import { ICreditCardFormData } from "../redux/slices/forms";
import { IReservationSliceState } from "../redux/slices/retrievedDetails";

interface Props {
	creditCardDetails: ICreditCardFormData;
	reservationDetails: IReservationSliceState;
}

export function bodyInsertCard({ creditCardDetails, reservationDetails }: Props) {
	const currentDate = new Date();
	const currentISODate = currentDate.toISOString();

	const newCCExpiryDate = new Date(`20${creditCardDetails.yearExpiry}-${creditCardDetails.monthExpiry}-20`);
	const newCCExpiryISODate = newCCExpiryDate.toISOString();

	const postBody = {
		creditCardId: 0,
		customerId: reservationDetails.customerId,
		creditCardType: creditCardDetails.type,
		creditCardNo: creditCardDetails.number,
		creditCardExpiryDate: newCCExpiryISODate,
		creditCardCVSNo: creditCardDetails.cvv,
		createdDate: currentISODate,
		lastUpdatedBy: 0,
		lastUpdatedDate: currentISODate,
		isDeleted: 0,
		creditCardBillingZipCode: creditCardDetails.billingZip,
		year: creditCardDetails.yearExpiry,
		month: creditCardDetails.monthExpiry,
		creditCardExpiryDateStr: newCCExpiryISODate,
		nameOnCard: creditCardDetails.name,
		token: "",
		gatewayCustomerID: "",
		gatewayRedirectFlow: "",
		gatewayMandateID: "",
		isActive: true,
	};

	return postBody;
}

export function bodyInsertV3Card(creditCardDetails: ICreditCardFormData) {
	return {
		creditCardType: creditCardDetails.type,
		creditCardNumber: creditCardDetails.number,
		creditCardExpiryMonth: parseInt(creditCardDetails.monthExpiry),
		creditCardExpiryYear: parseInt(`20${creditCardDetails.yearExpiry}`),
		creditCardCVSNumber: creditCardDetails.cvv,
		nameOnCard: creditCardDetails.name,
		creditCardBillingZipCode: creditCardDetails.billingZip,
		gatewayMandateID: null,
		gatewayRedirectFlow: null,
		gatewayCustomerID: null,
	};
}
