import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initializeAppThunk } from "./thunks";

const appStates = [
	"authenticating",
	"loaded",
	"authentication_error",
	"core_details_fetch_failed",
	"submission_loading",
] as const;
export const supportedLanguages = ["en", "de", "fr", "es"] as const;

// type Controllers = typeof allControllerFlows[number];
type AppState = typeof appStates[number];
export type SupportedLanguages = typeof supportedLanguages[number];

export interface ConfigSliceState {
	lang: string;
	status: AppState;
	clientId: string | null;
	responseTemplateId: string | null;
	flow: string[];
	rawConfig: string;
	rawQueryString: string;
	fromRentall: boolean;
	referenceType: string;
	qa: boolean;
}

const initialState: ConfigSliceState = {
	lang: "en",
	status: "authenticating",
	clientId: null,
	responseTemplateId: null,
	flow: ["Default/CreditCardForm"],
	rawConfig: "",
	rawQueryString: "",
	fromRentall: true,
	referenceType: "Reservation",
	qa: false,
};

const configSlice = createSlice({
	name: "config",
	initialState,
	reducers: {
		setLang: (state, action: PayloadAction<{ lang: string | null }>) => {
			if (action.payload.lang && supportedLanguages.includes(action.payload.lang as any)) {
				state.lang = action.payload.lang;
			}
		},
		setRawConfig: (state, action: PayloadAction<{ rawConfig: string; rawQueryString: string }>) => {
			state.rawConfig = action.payload.rawConfig;
			state.rawQueryString = action.payload.rawQueryString;
		},
		setAppStatus: (state, action: PayloadAction<{ status: AppState }>) => {
			state.status = action.payload.status;
		},
		setConfigValues: (
			state,
			action: PayloadAction<{
				clientId: string;
				responseTemplateId: string;
				flow: string[];
				fromRentall: boolean;
				qa: boolean;
			}>
		) => {
			state.clientId = action.payload.clientId;
			state.responseTemplateId = action.payload.responseTemplateId;
			if (action.payload?.flow?.length > 0) {
				state.flow = action.payload.flow;
			}
			state.fromRentall = action.payload.fromRentall;
			state.qa = action.payload.qa;
		},
		setReferenceType: (state, action: PayloadAction<{ referenceType: string }>) => {
			state.referenceType = action.payload.referenceType;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(initializeAppThunk.pending, (state) => {
			state.status = "authenticating";
		});
	},
});

export const { setLang, setConfigValues, setAppStatus, setRawConfig, setReferenceType } = configSlice.actions;

export default configSlice;
