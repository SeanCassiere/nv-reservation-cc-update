import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const common = "common";
const en = "en";
const languagesCore = [common, en, "de", "fr", "es"];
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

      for (const coreLang of languagesCore.filter((l) => l !== "dev")) {
        if (code.startsWith(`${coreLang}-`)) {
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
