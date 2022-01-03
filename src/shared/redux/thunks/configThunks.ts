import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import client from "../../api/client";

import { setAccessToken, setAccessTokenV3 } from "../slices/config";
import { setReservationDetails } from "../slices/retrievedDetails";
import { RootState } from "../store";

export const secrets = {
	client: process.env.REACT_APP_V3_CLIENT_ID ?? "",
	secret: process.env.REACT_APP_V3_CLIENT_SECRET ?? "",
	auth_url: process.env.REACT_APP_V3_AUTH_URL ?? "",
};

export const authenticateAppThunk = createAsyncThunk(
	"config/authenticateApp",
	async (_, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const { clientId } = state.config;
		try {
			const v3Params = new URLSearchParams();
			v3Params.append("grant_type", "client_credentials");
			v3Params.append("client_id", secrets.client);
			v3Params.append("client_secret", secrets.secret);
			v3Params.append("scope", "Api");
			const v3 = await axios.post(secrets.auth_url, v3Params, {
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			dispatch(setAccessTokenV3({ token: v3.data.access_token }));

			const auth = await client.post("/Login/GetClientSecretToken", {
				ClientId: clientId,
				ConsumerType: "Admin,Basic",
			});

			const {
				apiToken: { access_token },
			} = auth.data as { apiToken: { access_token: string } };
			dispatch(setAccessToken({ token: access_token }));

			const { reservationId } = state.retrievedDetails;
			try {
				const res = await client.get(`/Reservation/GetReservationById?reservationId=${reservationId}`, {
					headers: { Authorization: `Bearer ${access_token}` },
				});

				const {
					startLocationId: locationId,
					customerId,
					customerMail: customerEmail,
					reservationNumber: reservationNo,
				} = res.data.reservationview;

				const reservationInfo = {
					locationId,
					customerId,
					customerEmail,
					reservationNo,
				};

				dispatch(setReservationDetails(reservationInfo));
				return true;
			} catch (error) {
				return rejectWithValue(error);
			}
		} catch (error) {
			return rejectWithValue(new Error("Authentication failed"));
		}
	}
);
