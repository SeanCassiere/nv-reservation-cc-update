import { SUBMITTING_FORM_ERROR, SUBMITTING_FORM_SUCCESS, SUBMITTING_FORM_LOADING } from "./reducerConstants";

export const reducer = (state, action) => {
	switch (action.type) {
		case SUBMITTING_FORM_LOADING:
			return { ...state, loadingFormSubmit: true };
		case SUBMITTING_FORM_ERROR:
			return { ...state, error: true, loadingFormSubmit: false };
		case SUBMITTING_FORM_SUCCESS:
			return { error: false, loadingFormSubmit: false, submitFormSuccess: true };
		default:
			return state;
	}
};

export const initialState = {
	error: false,
	loadingFormSubmit: false,
	submitFormSuccess: false,
};
