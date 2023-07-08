import { z } from "zod";

import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { SupportedEnvironments, getLambdaAuthUrlForEnvironment } from "@/utils/app-env";

const SUBMISSION_COMPLETION_URL = "/api/complete";

const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export async function authenticateWithLambda(opts: { clientId: string; environment: SupportedEnvironments }) {
  const { referenceType, referenceIdentifier, responseTemplateId } = useRuntimeStore.getState();
  const { disableGlobalDocumentsForConfirmationEmail, predefinedAdminUserId } = useConfigStore.getState();

  const authUrl = getLambdaAuthUrlForEnvironment(opts.environment);

  let isError = false;
  const details = await fetch(authUrl, {
    method: "POST",
    body: JSON.stringify({
      client_id: `${opts.clientId}`,
      reference_type: `${referenceType}`,
      reference_id: `${referenceIdentifier}`,
    }),
  })
    .then((res) => res.json())
    .then((data) => tokenSchema.parse(data))
    .catch((err) => {
      console.error("Auth Error", err);
      isError = true;
    });

  if (isError || !details) {
    throw new Error("Failed to authenticate");
  }

  return {
    ...details,
    clientId: opts.clientId,
    referenceType,
    referenceIdentifier,
    responseTemplateId,
    disableGlobalDocumentsForConfirmationEmail,
    userId: predefinedAdminUserId,
  };
}

export async function postCompletionLambda(opts: {
  status: string;
  qa: boolean;
  clientId: string | number;
  customerId: string | number;
  referenceType: string;
  referenceId: string | number;
}) {
  const params = new URLSearchParams();
  if (opts.qa) {
    params.append("qa", "true");
  }
  params.append("client_id", `${opts.clientId}`);
  params.append("reference_type", `${opts.referenceType}`);
  params.append("reference_id", `${opts.referenceId}`);
  params.append("customer_id", `${opts.customerId}`);
  params.append("status", opts.status);
  return fetch(SUBMISSION_COMPLETION_URL + "?" + params.toString());
}
