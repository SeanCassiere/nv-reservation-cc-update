import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRetrievedDetailsSliceState {
	locationId: number;
	locationEmail: string;
	customerId: number;
	reservationId: number;
	customerEmail: string;
	ccEmails: string[];
	reservationNo: string;
	responseTemplateTypeId: number;
	responseTemplateBlobUrl: string;
	responseTemplateSubject: string;
}

const initialState: IRetrievedDetailsSliceState = {
	locationId: 0,
	locationEmail: "",
	customerId: 0,
	reservationId: 0,
	customerEmail: "",
	ccEmails: [],
	reservationNo: "",
	responseTemplateTypeId: 0,
	responseTemplateBlobUrl: "",
	responseTemplateSubject: "",
};

const retrievedDetailsSlice = createSlice({
	name: "retrievedDetails",
	initialState,
	reducers: {
		setReservationId: (state, action: PayloadAction<number | string>) => {
			state.reservationId = typeof action.payload === "string" ? parseInt(action.payload) : action.payload;
			state.reservationNo = `${action.payload}`;
		},
		setCcEmails: (state, action: PayloadAction<string[]>) => {
			state.ccEmails = action.payload;
		},
		setEmailTemplateDetails: (state, action: PayloadAction<{ subjectLine: string; templateTypeId: number }>) => {
			state.responseTemplateSubject = action.payload.subjectLine;
			state.responseTemplateTypeId = action.payload.templateTypeId;
		},
		setPreviewHtmlBlobUrl: (state, action: PayloadAction<string>) => {
			state.responseTemplateBlobUrl = action.payload;
		},
		setReservationDetails: (state, action) => {
			state.customerId = action.payload.customerId;
			state.locationId = action.payload.locationId;
			state.customerEmail = action.payload.customerEmail;
			state.reservationNo = action.payload.reservationNo;
			state.locationEmail = action.payload.locationEmail;
		},
	},
});

export const { setReservationId, setReservationDetails, setCcEmails, setEmailTemplateDetails, setPreviewHtmlBlobUrl } =
	retrievedDetailsSlice.actions;

export default retrievedDetailsSlice;
