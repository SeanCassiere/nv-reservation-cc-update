import { z } from "zod";

import { APP_CONSTANTS, APP_DEFAULTS } from "@/utils/constants";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { base64Encode } from "@/utils/base64";

const REQUIRED = "Required";

export const configObjectFormSchema = z.object({
  referenceId: z.string().min(1, REQUIRED),
  referenceType: z.string().min(1, REQUIRED),
  lang: z.string().min(1, REQUIRED),
  qa: z.boolean().default(false),
  dev: z.boolean().default(false),
  clientId: z.string().min(1, REQUIRED),
  userId: z.string().min(1, REQUIRED),
  emailTemplateId: z.string().min(1, REQUIRED),
  flow: z.array(z.object({ value: z.string() })),
  successSubmissionScreen: z.string().min(1, REQUIRED),
  showPreSubmitSummary: z.boolean().default(false),
  stopEmailGlobalDocuments: z.boolean().default(false),
  stopAttachingDriverLicenseFiles: z.boolean().default(false),
  colorScheme: z.string(),
});

export type ConfigObjectFormValues = z.infer<typeof configObjectFormSchema>;

export function makeUrlQueryFromConfigObject(config: ConfigObjectFormValues): string {
  const params = new URLSearchParams();
  if (config.qa) params.append("qa", "true");
  if (config.dev) params.append("dev", "true");

  // setting agreementId or reservationId
  if (config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT) {
    params.append("agreementId", `${config.referenceId}`);
  } else {
    params.append("reservationId", `${config.referenceId}`);
  }

  // setting lang
  params.append("lang", `${config.lang}`);

  // setting the config
  const hashObj = {
    clientId: Number(config.clientId) ?? Number(useRuntimeStore.getState().clientId),

    ...(Number(config.userId) > 0 ? { userId: Number(config.userId) } : {}),

    emailTemplateId: Number(config.emailTemplateId) ?? Number(useRuntimeStore.getState().responseTemplateId),

    flow: config.flow.length > 0 ? config.flow.map((f) => f.value) : APP_DEFAULTS.FLOW_SCREENS,

    ...(config.successSubmissionScreen !== APP_DEFAULTS.SUCCESS_SUBMISSION_SCREEN
      ? {
          successSubmissionScreen: config.successSubmissionScreen,
        }
      : {}),

    ...(config.showPreSubmitSummary !== APP_DEFAULTS.SHOW_PRE_SUBMIT_SUMMARY
      ? { showPreSubmitSummary: config.showPreSubmitSummary }
      : {}),

    ...(config.stopEmailGlobalDocuments !== APP_DEFAULTS.STOP_EMAIL_GLOBAL_DOCUMENTS
      ? { stopEmailGlobalDocuments: config.stopEmailGlobalDocuments }
      : {}),

    ...(config.stopAttachingDriverLicenseFiles !== APP_DEFAULTS.STOP_ATTACHING_DRIVER_LICENSE_FILES
      ? { stopAttachingDriverLicenseFiles: config.stopAttachingDriverLicenseFiles }
      : {}),

    ...(config.colorScheme !== APP_DEFAULTS.COLOR_SCHEME ? { colorScheme: config.colorScheme } : {}),
  };

  // JSON stringify and base64 encode the config object
  const objJsonStr = JSON.stringify(hashObj);
  const objJsonB64 = base64Encode(objJsonStr);

  return params.toString() + "&config=" + objJsonB64;
}
