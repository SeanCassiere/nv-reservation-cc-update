import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

import { supportedLanguages } from "./shared/redux/slices/config/slice";

i18n
	.use(HttpApi)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		supportedLngs: supportedLanguages,
		detection: {
			order: ["querystring"],
			lookupQuerystring: "lang",
		},
		fallbackLng: "en",
		debug: process.env.REACT_APP_DEVELOPMENT ? true : false,
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
