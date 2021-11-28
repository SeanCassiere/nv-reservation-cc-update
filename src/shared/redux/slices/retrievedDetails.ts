import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IReservationSliceState {
	locationId: number;
	customerId: number;
	reservationId: number;
	customerEmail: string;
	reservationNo: string;
}

const initialState: IReservationSliceState = {
	locationId: 0,
	customerId: 0,
	reservationId: 0,
	customerEmail: "",
	reservationNo: "",
};

const reservationSlice = createSlice({
	name: "retrievedDetails",
	initialState,
	reducers: {
		setReservationId: (state, action: PayloadAction<number | string>) => {
			state.reservationId = typeof action.payload === "string" ? parseInt(action.payload) : action.payload;
		},
		setReservationDetails: (state, action) => {
			state.customerId = action.payload.customerId;
			state.locationId = action.payload.locationId;
			state.customerEmail = action.payload.customerEmail;
			state.reservationNo = action.payload.reservationNo;
		},
	},
});

export const { setReservationId, setReservationDetails } = reservationSlice.actions;

export default reservationSlice;
