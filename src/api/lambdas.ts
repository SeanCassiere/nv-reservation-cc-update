import { z } from "zod";

import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import { SupportedEnvironments } from "@/utils/app-env";

const AUTHORIZATION_URL = "/api/token";
const SUBMISSION_COMPLETION_URL = "/api/complete";

const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export async function authenticateWithLambda(opts: { clientId: string; environment: SupportedEnvironments }) {
  const { referenceType, referenceIdentifier, responseTemplateId } = useRuntimeStore.getState();
  const { disableGlobalDocumentsForConfirmationEmail, predefinedAdminUserId } = useConfigStore.getState();

  const authUrl = AUTHORIZATION_URL;

  let isError = false;
  const details = await fetch(authUrl, {
    method: "POST",
    body: JSON.stringify({
      client_id: `${opts.clientId}`,
      reference_type: `${referenceType}`,
      reference_id: `${referenceIdentifier}`,
      environment: opts.environment,
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
  clientId: string | number;
  customerId: string | number;
  referenceType: string;
  referenceId: string | number;
  environment: SupportedEnvironments;
}) {
  return await fetch(SUBMISSION_COMPLETION_URL, {
    method: "POST",
    body: JSON.stringify({
      client_id: `${opts.clientId}`,
      reference_type: `${opts.referenceType}`,
      reference_id: `${opts.referenceId}`,
      customer_id: `${opts.customerId}`,
      status: opts.status,
      environment: opts.environment,
    }),
  });
}
