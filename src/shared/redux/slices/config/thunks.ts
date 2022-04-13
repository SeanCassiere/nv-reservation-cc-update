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
	setRetrievedRentalDetails,
} from "../retrievedDetails/slice";
import { RootState } from "../../store";
import { getReservationByIdOrNumber } from "../../../api/reservationApi";

interface User {
	isReservationEmail: boolean;
	email: string;
	isActive: boolean;
}

const AUTH_URL = process.env.REACT_APP_V3_AUTH_URL ?? "/.netlify/functions/GetTokenV3";

// const auth = await client.post("/Login/GetClientSecretToken", {
// 	ClientId: clientId,
// 	ConsumerType: "Admin,Basic",
// });
// dispatch(setAccessToken({ token: auth.data.apiToken.access_token }));

export const authenticateAppThunk = createAsyncThunk(
	"config/authenticateApp",
	async (_, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const { clientId, responseTemplateId } = state.config;
		console.groupCollapsed("config/authenticateApp");

		// authenticate app
		try {
			const authV3 = await axios.get(AUTH_URL);

			if (authV3.status !== 200 || !authV3.data.access_token || !authV3.data.token_type) {
				throw new Error("Authentication failed");
			}

			dispatch(setAccessToken({ access_token: authV3.data.access_token, token_type: authV3.data.token_type }));
		} catch (error) {
			console.error("get authentication tokens", error);
			console.groupEnd();
			return dispatch(setAppStatus({ status: "authentication_error" }));
		}

		if (state.config.referenceType === "Reservation") {
			const reservationResponse = await getReservationByIdOrNumber(
				clientId,
				state.retrievedDetails.referenceNo,
				state.retrievedDetails.referenceId
			);

			if (!reservationResponse) {
				console.error("NOT ABLE TO FIND RESERVATION");
				console.groupEnd();
				return dispatch(setAppStatus({ status: "reservation_fetch_failed" }));
			}

			dispatch(setRetrievedRentalDetails(reservationResponse));
		} else if (state.config.referenceType === "Agreement") {
			// code not implemented
			return dispatch(setAppStatus({ status: "reservation_fetch_failed" }));
		}

		// get cc emails
		try {
			const res = await clientV3.get(`/Users`, {
				params: {
					clientId: clientId,
				},
			});
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
			const res = await clientV3.get(`/Emails/${responseTemplateId}/EmailTemplate`, {
				params: { clientId: clientId },
			});
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
