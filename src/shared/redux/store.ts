import { configureStore, combineReducers } from "@reduxjs/toolkit";

import configSlice from "./slices/config";
import formsSlice from "./slices/forms";
import reservationSlice from "./slices/retrievedDetails";

const batchedReducers = combineReducers({
	[configSlice.name]: configSlice.reducer,
	[reservationSlice.name]: reservationSlice.reducer,
	[formsSlice.name]: formsSlice.reducer,
});

const store = configureStore({
	reducer: batchedReducers,
	middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof batchedReducers>;

export const selectConfigState = (state: RootState) => state.config;
export const selectSubmissionState = (state: RootState) => state.forms.submission;
export const selectTranslations = (state: RootState) => state.config.translations;

export const selectCreditCardForm = (state: RootState) => state.forms.creditCardForm;
export const selectRetrievedDetails = (state: RootState) => state.retrievedDetails;

export default store;
