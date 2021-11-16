import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import translations from "../../assets/translations.json";
import { authenticateAppThunk } from "../thunks/configThunks";

// import { allControllerFlows } from "../../utils/controllerFlows";

const appStates = ["authenticating", "loaded", "authentication_error", "submission_loading"] as const;
const supportedLanguages = ["en", "de", "fr", "es"] as const;

// type Controllers = typeof allControllerFlows[number];
type AppState = typeof appStates[number];
type SupportedLanguages = typeof supportedLanguages[number];
export type LangFile = typeof translations.en;

export interface ConfigSliceState {
	lang: SupportedLanguages;
	status: AppState;
	translations: LangFile;
	clientId: string | null;
	responseTemplateId: string | null;
	flow: string[];
	token: string | null;
}

const initialState: ConfigSliceState = {
	lang: "en",
	status: "authenticating",
	translations: translations.en,
	clientId: null,
	responseTemplateId: null,
	flow: ["Default/CreditCardForm"],
	token: null,
};

const configSlice = createSlice({
	name: "config",
	initialState,
	reducers: {
		setLang: (state, action: PayloadAction<{ lang: SupportedLanguages }>) => {
			if (supportedLanguages.includes(action.payload.lang)) {
				state.lang = action.payload.lang;
				state.translations = translations[action.payload.lang];
			}
		},
		setAccessToken: (state, action: PayloadAction<{ token: string }>) => {
			state.token = action.payload.token;
		},
		setAppStatus: (state, action: PayloadAction<{ status: AppState }>) => {
			state.status = action.payload.status;
		},
		setConfigValues: (
			state,
			action: PayloadAction<{ clientId: string; responseTemplateId: string; flow: string[] }>
		) => {
			state.responseTemplateId = action.payload.responseTemplateId;
			state.clientId = action.payload.clientId;
			if (action.payload?.flow?.length > 0) {
				state.flow = action.payload.flow;
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(authenticateAppThunk.pending, (state) => {
			state.status = "authenticating";
		});
		builder.addCase(authenticateAppThunk.fulfilled, (state) => {
			state.status = "loaded";
		});
		builder.addCase(authenticateAppThunk.rejected, (state) => {
			state.status = "authentication_error";
		});
	},
});

export const { setAccessToken, setLang, setConfigValues, setAppStatus } = configSlice.actions;

export default configSlice;
