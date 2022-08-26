import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const supportedLanguages = ["en", "en-GB", "de", "fr", "es"] as const;

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
    debug: import.meta.env.VITE_APP_DEVELOPMENT ? true : false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
