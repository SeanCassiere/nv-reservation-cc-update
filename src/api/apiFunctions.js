import axios from "axios";

const BASE_URL = "https://app.navotar.com/api";

export const updateCreditCardByCustomerId = async (clientId, reservationId, ccInfo) => {
	const API_BODY = { ClientId: clientId, ConsumerType: "Admin,Basic" };
	let token = "";
	let customerId = "";

	// Getting Auth Token
	try {
		const config = { headers: { "Content-Type": "application/json" } };
		const { data } = await axios.post(`${BASE_URL}/Login/GetClientSecretToken`, API_BODY, config);

		token = data.apiToken.access_token;
	} catch (error) {
		// console.log(`Auth Error: \n${error}`);
		throw new Error("Auth Failed");
	}

	if (token.length === 0) throw new Error("Token has not been returned from the API.");

	const globalConfig = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };

	// Getting Customer Id by Reservation Id
	try {
		const { data } = await axios.get(
			`${BASE_URL}/Reservation/GetReservationById?reservationId=${reservationId}`,
			globalConfig
		);

		customerId = data.reservationview.customerId;
	} catch (error) {
		// console.log(`Finding Reservation Error: ${error}`);
		throw new Error("Could not find the reservation.");
	}

	// Formatting for Credit Card Input
	const { name, number, monthExpiry, yearExpiry, cvc, billingZip, ccType } = ccInfo;
	const currentDate = new Date();
	const currentISODate = currentDate.toISOString();

	const newCCExpiryDate = new Date(`20${yearExpiry}-${monthExpiry}-20`);
	const newCCExpiryISODate = newCCExpiryDate.toISOString();

	const ccPostBody = {
		creditCardId: 0,
		customerId: customerId,
		creditCardType: ccType,
		creditCardNo: number,
		creditCardExpiryDate: newCCExpiryISODate,
		creditCardCVSNo: cvc,
		createdDate: currentISODate,
		lastUpdatedBy: 0,
		lastUpdatedDate: currentISODate,
		isDeleted: 0,
		creditCardBillingZipCode: billingZip,
		year: yearExpiry,
		month: monthExpiry,
		creditCardExpiryDateStr: newCCExpiryISODate,
		nameOnCard: name,
		token: "",
		gatewayCustomerID: "",
		gatewayRedirectFlow: "",
		gatewayMandateID: "",
		isActive: true,
	};

	// Insert the Credit Card Info by Customer Id
	try {
		await axios.post(`${BASE_URL}/Customer/InsertCreditCard`, ccPostBody, globalConfig);
	} catch (error) {
		// console.log(`Credit Card Insert Error: ${error}`);
		throw new Error("Error inserting the credit card details.");
	}
};
