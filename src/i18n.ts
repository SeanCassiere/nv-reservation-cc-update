import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

const common = "common";

// Using language codes from https://github.com/ladjs/i18n-locales
const en = "en";
const languagesCore = [common, en, "de", "fr", "es", "ar", "ru"];
const languagesExtensions = ["en-GB"];
export const supportedLanguages = [...languagesCore, ...languagesExtensions].filter((l) => l !== common);

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["querystring"],
      lookupQuerystring: "lang",
    },
    cleanCode: true,
    fallbackLng: (code) => {
      let langsToUse = [common];
      let foundLang = false;

      for (const coreLang of languagesCore.filter((l) => l !== common)) {
        if (code && String(code).startsWith(`${coreLang}-`)) {
          langsToUse = [coreLang, ...langsToUse];
          foundLang = true;
          break;
        }
      }

      if (!foundLang) {
        langsToUse = [en, ...langsToUse];
      }
      return langsToUse;
    },
    interpolation: { escapeValue: false },
    debug: import.meta.env.VITE_APP_DEVELOPMENT ? true : false,
  });

export default i18n;
