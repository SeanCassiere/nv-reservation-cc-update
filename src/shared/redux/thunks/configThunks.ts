import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import client from "../../api/client";
import clientV3 from "../../api/clientV3";

import { setAccessToken, setAccessTokenV3, setAppStatus } from "../slices/config";
import { setReservationDetails } from "../slices/retrievedDetails";
import { RootState } from "../store";

const AUTH_URL = process.env.REACT_APP_V3_AUTH_URL ?? "/.netlify/functions/GetTokenV3";

export const authenticateAppThunk = createAsyncThunk(
	"config/authenticateApp",
	async (_, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const { clientId, responseTemplateId } = state.config;
		const { reservationId } = state.retrievedDetails;
		console.groupCollapsed("config/authenticateApp");
		console.log("responseTemplateId", responseTemplateId);
		console.groupEnd();

		// authenticate app
		try {
			const authV3 = await axios.get(AUTH_URL);
			dispatch(setAccessTokenV3({ token: authV3.data.access_token }));

			const auth = await client.post("/Login/GetClientSecretToken", {
				ClientId: clientId,
				ConsumerType: "Admin,Basic",
			});

			dispatch(setAccessToken({ token: auth.data.apiToken.access_token }));
		} catch (error) {
			dispatch(setAppStatus({ status: "authentication_error" }));
			return false;
		}

		// get reservation details
		try {
			const res = await clientV3.get(`/Reservations/${reservationId}?ClientId=${clientId}`);

			const {
				startLocationId: locationId,
				customerId,
				email: customerEmail,
				reservationNumber: reservationNo,
			} = res.data.reservationview;

			const reservationInfo = {
				locationId,
				customerId,
				customerEmail,
				reservationNo,
			};

			dispatch(setReservationDetails(reservationInfo));
		} catch (error) {
			dispatch(setAppStatus({ status: "reservation_fetch_failed" }));
			return false;
		}
		return dispatch(setAppStatus({ status: "loaded" }));
		// 	try {
		// 		const { data: v3Data } = await axios.get(AUTH_URL);
		// 		dispatch(setAccessTokenV3({ token: v3Data.access_token }));

		// 		const auth = await client.post("/Login/GetClientSecretToken", {
		// 			ClientId: clientId,
		// 			ConsumerType: "Admin,Basic",
		// 		});

		// 		const {
		// 			apiToken: { access_token },
		// 		} = auth.data as { apiToken: { access_token: string } };
		// 		dispatch(setAccessToken({ token: access_token }));

		// 		const { reservationId } = state.retrievedDetails;
		// 		try {
		// 			const res = await clientV3.get(`/Reservations/${reservationId}?ClientId=${clientId}`);

		// 			const {
		// 				startLocationId: locationId,
		// 				customerId,
		// 				email: customerEmail,
		// 				reservationNumber: reservationNo,
		// 			} = res.data.reservationview;

		// 			const reservationInfo = {
		// 				locationId,
		// 				customerId,
		// 				customerEmail,
		// 				reservationNo,
		// 			};

		// 			dispatch(setReservationDetails(reservationInfo));
		// 			return true;
		// 		} catch (error) {
		// 			return rejectWithValue(error);
		// 		}
		// 	} catch (error) {
		// 		return rejectWithValue(new Error("Authentication failed"));
		// 	}
	}
);
