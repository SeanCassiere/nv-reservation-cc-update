import "i18next";
import translationEn from "../public/locales/en/translation.json";
import translationCommon from "../public/locales/common/translation.json";

const defaultAndDev = { ...translationEn, ...translationCommon };

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: typeof defaultAndDev;
  }
}
