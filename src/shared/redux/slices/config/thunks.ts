import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import clientV3 from "../../../api/clientV3";
import { bodyEmailTemplate } from "../../../utils/bodyEmailTemplate";

import { setAppStatus } from "./slice";
import { setAccessToken } from "../auth/slice";
import {
	setCcEmails,
	setEmailTemplateDetails,
	setPreviewHtmlBlobUrl,
	setReservationDetails,
} from "../retrievedDetails/slice";
import { RootState } from "../../store";

interface User {
	isReservationEmail: boolean;
	email: string;
	isActive: boolean;
}

const AUTH_URL = process.env.REACT_APP_V3_AUTH_URL ?? "/.netlify/functions/GetTokenV3";

export const authenticateAppThunk = createAsyncThunk(
	"config/authenticateApp",
	async (_, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const { clientId, responseTemplateId } = state.config;
		const { reservationId } = state.retrievedDetails;
		console.groupCollapsed("config/authenticateApp");

		// authenticate app
		try {
			const authV3 = await axios.get(AUTH_URL);
			dispatch(setAccessToken({ access_token: authV3.data.access_token, token_type: authV3.data.token_type }));

			// const auth = await client.post("/Login/GetClientSecretToken", {
			// 	ClientId: clientId,
			// 	ConsumerType: "Admin,Basic",
			// });

			// dispatch(setAccessToken({ token: auth.data.apiToken.access_token }));
		} catch (error) {
			console.error("get authentication tokens", error);
			console.groupEnd();
			return dispatch(setAppStatus({ status: "authentication_error" }));
		}

		// get reservation details
		try {
			const res = await clientV3.get(`/Reservations/${reservationId}?ClientId=${clientId}`);

			const {
				startLocationId: locationId,
				customerId,
				email: customerEmail,
				reservationNumber: reservationNo,
				locationEmail,
			} = res.data.reservationview;

			const reservationInfo = {
				locationId,
				customerId,
				customerEmail,
				reservationNo,
				locationEmail,
			};

			dispatch(setReservationDetails(reservationInfo));
		} catch (error) {
			console.error("get reservation emails", error);
			console.groupEnd();
			return dispatch(setAppStatus({ status: "reservation_fetch_failed" }));
		}

		// get cc emails
		try {
			const res = await clientV3.get(`/Users?clientId=${clientId}`);
			const reservationEmailUsers: User[] = res.data
				.filter((u: User) => u.isReservationEmail)
				.filter((u: User) => u.email && u.email.trim() !== "")
				.filter((u: User) => u.isActive);
			const emailsToCC = reservationEmailUsers.map((u: User) => u.email);

			dispatch(setCcEmails(emailsToCC));
		} catch (error) {
			console.error("get cc emails", error);
			console.groupEnd();
			return dispatch(setAppStatus({ status: "authentication_error" }));
		}

		// get email template
		try {
			const res = await clientV3.get(`/Emails/${responseTemplateId}/EmailTemplate?clientId=${clientId}`);
			const { templateTypeId, subjectLine } = res.data;

			dispatch(setEmailTemplateDetails({ templateTypeId, subjectLine }));
		} catch (error) {
			console.error("get email template details", error);
			console.groupEnd();
			// failing to fetch the email template details should not fail the app
			// return dispatch(setAppStatus({ status: "authentication_error" }));
		}

		// get email preview html and turn into a blob url
		try {
			const { retrievedDetails, config: configDetails } = getState() as RootState;
			if (retrievedDetails.responseTemplateTypeId !== 0) {
				const res = await clientV3.post(
					"/Emails/PreviewTemplate",
					bodyEmailTemplate({ reservationDetails: retrievedDetails, config: configDetails })
				);

				const blob = new Blob([res.data], { type: "text/html" });
				const url = URL.createObjectURL(blob);

				dispatch(setPreviewHtmlBlobUrl(url));
			}
		} catch (error) {
			console.error("get email template html", error);
			console.groupEnd();
			// failing to fetch the email template html should not fail the app
			// return dispatch(setAppStatus({ status: "authentication_error" }));
		}

		console.groupEnd();
		return dispatch(setAppStatus({ status: "loaded" }));
	}
);
