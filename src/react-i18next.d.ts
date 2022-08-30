import "react-i18next";
import translationEn from "../public/locales/en/translation.json";
import translationCommon from "../public/locales/common/translation.json";

const defaultAndDev = { ...translationEn, ...translationCommon };

// react-i18next versions higher than 11.11.0
declare module "react-i18next" {
  // and extend them!
  interface CustomTypeOptions {
    // custom resources type
    resources: {
      defaultNS: typeof defaultAndDev;
    };
  }
}
