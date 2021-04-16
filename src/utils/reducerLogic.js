import {
	SUBMITTING_FORM_ERROR,
	SUBMITTING_FORM_SUCCESS,
	SUBMITTING_FORM_LOADING,
	AUTH_RESERVATION_ERROR,
	AUTH_RESERVATION_SUCCESS,
	AUTH_RESERVATION_LOADING,
} from "./reducerConstants";

export const reducer = (state, action) => {
	switch (action.type) {
		case AUTH_RESERVATION_LOADING:
			return { ...state, loadingReservationAuthentication: true };
		case AUTH_RESERVATION_ERROR:
			return { ...state, loadingReservationAuthentication: false, errorAuthenticating: true };
		case AUTH_RESERVATION_SUCCESS:
			return {
				...state,
				loadingReservationAuthentication: false,
				token: action.payload.token,
				reservationInfo: action.payload.reservationInfo,
			};
		case SUBMITTING_FORM_LOADING:
			return { ...state, loadingFormSubmit: true };
		case SUBMITTING_FORM_ERROR:
			return { ...state, errorSubmitting: true, loadingFormSubmit: false };
		case SUBMITTING_FORM_SUCCESS:
			return {
				...state,
				errorSubmitting: false,
				loadingFormSubmit: false,
				submitFormSuccess: true,
				loadingReservationAuthentication: false,
			};
		default:
			return state;
	}
};

export const initialState = {
	token: "",
	reservationInfo: {},
	errorSubmitting: false,
	errorAuthenticating: false,
	loadingReservationAuthentication: false,
	loadingFormSubmit: false,
	submitFormSuccess: false,
};
