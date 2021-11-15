import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import translations from "../../assets/translations.json";

const supportedLanguages = ["en", "de", "fr", "es"] as const;

type SupportedLanguages = typeof supportedLanguages[number];
type LangFile = typeof translations.en;

interface ConfigSliceState {
	lang: SupportedLanguages;
	isAppAuthSuccess: boolean;
	translations: LangFile;
	clientId: string | null;
	responseTemplateId: string | null;
	token: string | null;
}

const initialState: ConfigSliceState = {
	lang: "en",
	isAppAuthSuccess: true,
	translations: translations.en,
	clientId: null,
	responseTemplateId: null,
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
	},
});

export default configSlice;
