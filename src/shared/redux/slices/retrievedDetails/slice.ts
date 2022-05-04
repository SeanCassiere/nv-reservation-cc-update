import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReturnComposeEmailDetails } from "../../../api/emailsApi";

export interface IRetrievedDetailsSliceState {
	data: {
		locationId: number;
		locationEmail: string;
		customerName: string;
		customerId: number;
		driverId: number;
		customerEmail: string;
		isCheckIn: boolean;
	};
	adminUserId: number;
	referenceId: number;
	referenceNo: string;
	responseEmailsToCc: string[];
	responseTemplateTypeId: number;
	responseTemplateBlobUrl: string;
	responseTemplateSubject: string;
}

const initialState: IRetrievedDetailsSliceState = {
	data: {
		locationId: 0,
		locationEmail: "",
		customerName: "",
		customerId: 0,
		driverId: 0,
		customerEmail: "",
		isCheckIn: false,
	},
	adminUserId: 0,
	referenceId: 0,
	referenceNo: "",
	responseEmailsToCc: [],
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
		setSystemUserId: (state, action: PayloadAction<number>) => {
			state.adminUserId = action.payload;
		},
		setCcEmails: (state, action: PayloadAction<string[]>) => {
			state.responseEmailsToCc = action.payload;
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
			state.data.customerId = action.payload.customerId;
			state.data.locationId = action.payload.locationId;
			state.data.customerEmail = action.payload.customerEmail;
			state.data.locationEmail = action.payload.locationEmail;
			state.data.driverId = action.payload.driverId ?? state.data.driverId;
			state.data.customerName = action.payload?.driverName ?? state.data.customerName;
			state.data.isCheckIn = action.payload?.isCheckIn ?? state.data.isCheckIn;
		},
		setGetComposeEmailDetails: (state, action: PayloadAction<ReturnComposeEmailDetails>) => {
			state.data.locationEmail = action.payload.fromAddress;
			state.responseTemplateSubject = action.payload.selectedTemplate?.subjectLine || state.responseTemplateSubject;
		},
	},
});

export const {
	setRetrievedRentalDetails,
	setCcEmails,
	setEmailTemplateDetails,
	setPreviewHtmlBlobUrl,
	setInitialReferenceId,
	setSystemUserId,
	setGetComposeEmailDetails,
} = retrievedDetailsSlice.actions;

export default retrievedDetailsSlice;
