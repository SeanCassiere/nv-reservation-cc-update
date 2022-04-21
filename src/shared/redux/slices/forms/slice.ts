import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const submissionStates = [
	"submitting_details_pending",
	"submitting_details_error",
	"submitting_details_success",
] as const;
type SubmissionState = typeof submissionStates[number];
export interface ICreditCardFormData {
	name: string;
	type: string;
	number: string;
	cvv: string;
	billingZip: string;
	monthExpiry: string;
	yearExpiry: string;
}

interface IFormsSliceState {
	submission: {
		state: SubmissionState;
		current_submission_message: string;
		isSubmissionAttempted: boolean;
	};
	creditCardForm: {
		isReadyToSubmit: boolean;
		data: ICreditCardFormData;
	};
	licenseUploadForm: {
		isReadyToSubmit: boolean;
		data: {
			frontImageUrl: string | null;
			frontImageName: string | null;
			backImageUrl: string | null;
			backImageName: string | null;
		};
	};
	rentalSignatureForm: {
		isReadyToSubmit: boolean;
		data: {
			signatureUrl: string;
		};
	};
}

const initialState: IFormsSliceState = {
	submission: {
		state: "submitting_details_pending",
		current_submission_message: "",
		isSubmissionAttempted: false,
	},
	creditCardForm: {
		isReadyToSubmit: false,
		data: {
			name: "",
			type: "",
			number: "",
			cvv: "",
			billingZip: "",
			monthExpiry: "",
			yearExpiry: "",
		},
	},
	licenseUploadForm: {
		isReadyToSubmit: false,
		data: {
			frontImageUrl: null,
			frontImageName: null,
			backImageUrl: null,
			backImageName: null,
		},
	},
	rentalSignatureForm: {
		isReadyToSubmit: false,
		data: {
			signatureUrl: "",
		},
	},
};

const formsSlice = createSlice({
	name: "forms",
	initialState,
	reducers: {
		setCreditCardFormData: (state, action: PayloadAction<ICreditCardFormData>) => {
			state.creditCardForm.data = action.payload;
			state.creditCardForm.isReadyToSubmit = true;
		},
		setLicenseUploadFormData: (
			state,
			action: PayloadAction<{
				frontImageUrl: string;
				frontImageName: string;
				backImageUrl: string;
				backImageName: string;
			}>
		) => {
			state.licenseUploadForm.data.frontImageUrl = action.payload.frontImageUrl;
			state.licenseUploadForm.data.frontImageName = action.payload.frontImageName;
			state.licenseUploadForm.data.backImageUrl = action.payload.backImageUrl;
			state.licenseUploadForm.data.backImageName = action.payload.backImageName;
			state.licenseUploadForm.isReadyToSubmit = true;
		},
		setRentalSignatureFormData: (state, action: PayloadAction<{ signatureUrl: string; isReadyToSubmit: boolean }>) => {
			state.rentalSignatureForm.isReadyToSubmit = action.payload.isReadyToSubmit;
			state.rentalSignatureForm.data.signatureUrl = action.payload.signatureUrl;
		},
		setSubmissionState: (state, action: PayloadAction<SubmissionState>) => {
			state.submission.state = action.payload;
		},
		setSubmissionMessage: (state, action: PayloadAction<string>) => {
			state.submission.current_submission_message = action.payload;
		},
		setSubmissionErrorState: (state, action: PayloadAction<SubmissionState>) => {
			state.submission.state = action.payload;
			state.submission.isSubmissionAttempted = true;
		},
	},
});

export const {
	setCreditCardFormData,
	setSubmissionState,
	setLicenseUploadFormData,
	setRentalSignatureFormData,
	setSubmissionErrorState,
	setSubmissionMessage,
} = formsSlice.actions;

export default formsSlice;
