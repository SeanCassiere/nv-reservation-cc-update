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
	setReservationId,
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
		console.groupCollapsed("config/authenticateApp");

		// authenticate app
		try {
			const authV3 = await axios.get(AUTH_URL);

			if (authV3.status !== 200 || !authV3.data.access_token || !authV3.data.token_type) {
				throw new Error("Authentication failed");
			}

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

		let searchingForReservation = true;

		while (searchingForReservation) {
			const whileState = getState() as RootState;
			const { reservationId, reservationNo } = whileState.retrievedDetails;

			// get reservation details by id
			try {
				const res = await clientV3.get(`/Reservations/${reservationId}`, {
					params: {
						ClientId: clientId,
					},
				});

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
				console.log("found reservation");
				searchingForReservation = false;
			} catch (error) {
				console.error("could not find from GET /reservations/:id", error);
				console.groupEnd();
			}

			if (!searchingForReservation) break;

			// find the reservation by reservation number
			try {
				const res = await clientV3(`/Reservations`, {
					params: { ReservationNumber: reservationNo, clientId: clientId, userId: 0 },
				});
				const list = res.data;
				const findReservation = list.find(
					(r: { ReserveId: number; ReservationNumber: string }) => r.ReservationNumber === reservationNo
				);

				if (!findReservation) {
					console.error("could not find from GET /reservations?ReservationNumber=XXX");
					console.groupEnd();
					searchingForReservation = false;
					return dispatch(setAppStatus({ status: "reservation_fetch_failed" }));
				} else {
					searchingForReservation = true;
					dispatch(setReservationId(findReservation.ReserveId));
				}
			} catch (error) {
				console.error("could not find from GET /reservations?ReservationNumber=XXX", error);
				console.groupEnd();
				searchingForReservation = false;
				return dispatch(setAppStatus({ status: "reservation_fetch_failed" }));
			}

			if (!searchingForReservation) break;
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
