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
};

const formsSlice = createSlice({
	name: "forms",
	initialState,
	reducers: {
		setCreditCardFormData: (state, action: PayloadAction<ICreditCardFormData>) => {
			state.creditCardForm.data = action.payload;
			state.creditCardForm.isReadyToSubmit = true;
		},
		setSubmissionState: (state, action: PayloadAction<SubmissionState>) => {
			state.submission.state = action.payload;
		},
	},
});

export const { setCreditCardFormData, setSubmissionState } = formsSlice.actions;

export default formsSlice;
