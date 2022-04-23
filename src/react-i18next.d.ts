import "react-i18next";
import translation from "../public/locales/en/translation.json";

// react-i18next versions higher than 11.11.0
declare module "react-i18next" {
	// and extend them!
	interface CustomTypeOptions {
		// custom resources type
		resources: {
			defaultNS: typeof translation;
		};
	}
}
