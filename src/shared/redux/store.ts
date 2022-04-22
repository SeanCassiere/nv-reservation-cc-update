import { configureStore, combineReducers } from "@reduxjs/toolkit";

import configSlice from "./slices/config/slice";
import formsSlice from "./slices/forms/slice";
import reservationSlice from "./slices/retrievedDetails/slice";
import authSlice from "./slices/auth/slice";

const batchedReducers = combineReducers({
	[configSlice.name]: configSlice.reducer,
	[reservationSlice.name]: reservationSlice.reducer,
	[formsSlice.name]: formsSlice.reducer,
	[authSlice.name]: authSlice.reducer,
});

const store = configureStore({
	reducer: batchedReducers,
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof batchedReducers>;

export const selectConfigState = (state: RootState) => state.config;
export const selectSubmissionState = (state: RootState) => state.forms.submission;
export const selectAuthState = (state: RootState) => state.auth;

export const selectCreditCardForm = (state: RootState) => state.forms.creditCardForm;
export const selectLicenseUploadForm = (state: RootState) => state.forms.licenseUploadForm;
export const selectRentalSignatureForm = (state: RootState) => state.forms.rentalSignatureForm;

export const selectRetrievedDetails = (state: RootState) => state.retrievedDetails;

export default store;
