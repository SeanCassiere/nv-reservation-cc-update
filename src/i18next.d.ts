import "i18next";

import translationCommon from "../public/locales/common/translation.json";
import translationEn from "../public/locales/en/translation.json";

const defaultAndDev = { ...translationEn, ...translationCommon };

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof defaultAndDev;
    };
  }
}
