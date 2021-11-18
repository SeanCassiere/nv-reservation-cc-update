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
	};
	creditCardForm: {
		isReadyToSubmit: boolean;
		data: ICreditCardFormData;
	};
	licenseUploadForm: {
		isReadyToSubmit: boolean;
		data: {
			frontImageBase64: string | null;
			frontImageName: string | null;
			backImageBase64: string | null;
			backImageName: string | null;
		};
	};
}

const initialState: IFormsSliceState = {
	submission: {
		state: "submitting_details_pending",
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
			frontImageBase64: null,
			frontImageName: null,
			backImageBase64: null,
			backImageName: null,
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
				frontImageBase64: string | null;
				frontImageName: string | null;
				backImageBase64: string | null;
				backImageName: string | null;
			}>
		) => {
			state.licenseUploadForm.data.frontImageBase64 = action.payload.frontImageBase64;
			state.licenseUploadForm.data.frontImageName = action.payload.frontImageName;
			state.licenseUploadForm.data.backImageBase64 = action.payload.backImageBase64;
			state.licenseUploadForm.data.backImageName = action.payload.backImageName;
			state.licenseUploadForm.isReadyToSubmit = true;
		},

		setSubmissionState: (state, action: PayloadAction<SubmissionState>) => {
			state.submission.state = action.payload;
		},
	},
});

export const { setCreditCardFormData, setSubmissionState, setLicenseUploadFormData } = formsSlice.actions;

export default formsSlice;
