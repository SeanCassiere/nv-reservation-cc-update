import axios from "axios";

const BASE_URL = "https://app.navotar.com/api";

export const getReservationDetailsByReservationId = async (clientId, reservationId) => {
	const API_BODY = { ClientId: clientId, ConsumerType: "Admin,Basic" };
	let token = "";
	let reservationInfo = {};

	// Getting Auth Token
	try {
		const config = { headers: { "Content-Type": "application/json" } };
		const { data } = await axios.post(`${BASE_URL}/Login/GetClientSecretToken`, API_BODY, config);

		token = data.apiToken.access_token;
	} catch (error) {
		throw new Error("Auth Failed");
	}

	if (token.length === 0) throw new Error("Token has not been returned from the API.");

	const globalConfig = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };

	// Getting Reservation Details by Reservation Id
	try {
		const { data } = await axios.get(
			`${BASE_URL}/Reservation/GetReservationById?reservationId=${reservationId}`,
			globalConfig
		);

		const {
			startLocationId: locationId,
			customerId,
			customerMail: customerEmail,
			reservationNumber: reservationNo,
		} = data.reservationview;

		reservationInfo = {
			locationId,
			customerId,
			customerEmail,
			reservationNo,
		};

		return { token, reservationInfo };
	} catch (error) {
		// console.log(`Finding Reservation Error: ${error}`);
		throw new Error("Could not find the reservation.");
	}
};

export const insertCreditCardDetailsByCustomerId = async (token, customerId, creditCardDetails) => {
	// Formatting for Credit Card Input

	const { name, number, monthExpiry, yearExpiry, cvc, billingZip, ccType } = creditCardDetails;

	const currentDate = new Date();
	const currentISODate = currentDate.toISOString();

	const newCCExpiryDate = new Date(`20${yearExpiry}-${monthExpiry}-20`);
	const newCCExpiryISODate = newCCExpiryDate.toISOString();

	const globalConfig = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };

	const postBody = {
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

	// Inserting credit card details to customer profile by Customer Id
	try {
		await axios.post(`${BASE_URL}/Customer/InsertCreditCard`, postBody, globalConfig);
	} catch (error) {
		// console.log(`Credit Card Insert Error: ${error}`);
		throw new Error("Error inserting the credit card details.");
	}
};

export const sendConfirmationEmail = async (customerEmail, reservationNo, locationEmail) => {
	try {
		await axios.get(`/api/sendConfirmationEmail`, {
			params: {
				customerEmail,
				reservationNo,
				locationEmail,
			},
		});
	} catch (error) {
		// console.log(`Error sending confirmation email: ${error}`);
		throw new Error("Error sending confirmation email.");
	}
};

export const getLocationEmail = async (token, locationId) => {
	const globalConfig = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };

	try {
		const { data } = await axios.get(`${BASE_URL}/Location/GetLocation?id=${locationId}`, globalConfig);

		return { locationEmail: data.contactEmail };
	} catch (error) {
		// console.log(`Error fetching the location: ${error}`);
		throw new Error("Error fetching the location email.");
	}
};

export const sendConfirmationEmailWithNavotar = async (token, reservationId, clientId, emailTemplateId) => {
	try {
		const globalConfig = { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } };

		const postBody = {
			clientID: clientId,
			templateTypeId: 2,
			purposeId: reservationId,
			agreementId: 0,
			reservationId: reservationId,
		};

		await axios.post(`${BASE_URL}/api/Email/SendEmail`, postBody, globalConfig);
	} catch (error) {
		// console.log(`Error sending confirmation email through Navotar: ${error}`);
		throw new Error("Error sending confirmation email through Navotar.");
	}
};
