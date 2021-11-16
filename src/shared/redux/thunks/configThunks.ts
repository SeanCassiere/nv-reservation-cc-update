import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../api/client";

import { setAccessToken } from "../slices/config";
import { setReservationDetails } from "../slices/reservation";
import { RootState } from "../store";

export const authenticateAppThunk = createAsyncThunk(
	"config/authenticateApp",
	async (_, { dispatch, getState, rejectWithValue }) => {
		const state = getState() as RootState;
		const { clientId } = state.config;
		try {
			const auth = await client.post("/Login/GetClientSecretToken", {
				ClientId: clientId,
				ConsumerType: "Admin,Basic",
			});

			const {
				apiToken: { access_token },
			} = auth.data as { apiToken: { access_token: string } };
			dispatch(setAccessToken({ token: access_token }));

			const { reservationId } = state.reservation;
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
