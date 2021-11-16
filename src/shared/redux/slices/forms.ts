import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
	creditCardForm: {
		isReadyToSubmit: boolean;
		data: ICreditCardFormData;
	};
}

const initialState: IFormsSliceState = {
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
	},
});

export const { setCreditCardFormData } = formsSlice.actions;

export default formsSlice;
