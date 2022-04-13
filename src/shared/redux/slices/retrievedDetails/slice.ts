import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRetrievedDetailsSliceState {
	locationId: number;
	locationEmail: string;
	customerId: number;
	referenceId: number;
	referenceNo: string;
	customerEmail: string;
	ccEmails: string[];
	responseTemplateTypeId: number;
	responseTemplateBlobUrl: string;
	responseTemplateSubject: string;
}

const initialState: IRetrievedDetailsSliceState = {
	locationId: 0,
	locationEmail: "",
	customerId: 0,
	referenceId: 0,
	referenceNo: "",
	customerEmail: "",
	ccEmails: [],
	responseTemplateTypeId: 0,
	responseTemplateBlobUrl: "",
	responseTemplateSubject: "",
};

const retrievedDetailsSlice = createSlice({
	name: "retrievedDetails",
	initialState,
	reducers: {
		setInitialReferenceId: (state, action: PayloadAction<number | string>) => {
			state.referenceId = typeof action.payload === "string" ? parseInt(action.payload) : action.payload;
			state.referenceNo = `${action.payload}`;
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
		setRetrievedRentalDetails: (state, action) => {
			state.referenceNo = action.payload.referenceNo;
			state.referenceId = action.payload.referenceId;
			state.customerId = action.payload.customerId;
			state.locationId = action.payload.locationId;
			state.customerEmail = action.payload.customerEmail;
			state.locationEmail = action.payload.locationEmail;
		},
	},
});

export const {
	setRetrievedRentalDetails,
	setCcEmails,
	setEmailTemplateDetails,
	setPreviewHtmlBlobUrl,
	setInitialReferenceId,
} = retrievedDetailsSlice.actions;

export default retrievedDetailsSlice;
