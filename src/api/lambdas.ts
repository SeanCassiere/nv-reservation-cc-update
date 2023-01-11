import { useConfigStore } from "../hooks/stores/useConfigStore";
import { useRuntimeStore } from "../hooks/stores/useRuntimeStore";

const AUTH_URL = "/api/token";
const QA_AUTH_URL = "/api/token-qa";
const SUBMISSION_COMPLETION_URL = "/api/complete";

export async function authenticateWithLambda(opts: { clientId: string; qa: boolean }) {
  const { referenceType, referenceIdentifier, responseTemplateId } = useRuntimeStore.getState();
  const { disableGlobalDocumentsForConfirmationEmail, predefinedAdminUserId } = useConfigStore.getState();

  const params = new URLSearchParams();
  params.append("client_id", `${opts.clientId}`);
  params.append("reference_type", `${referenceType}`);
  params.append("reference_id", `${referenceIdentifier}`);

  const authUrl = opts.qa ? QA_AUTH_URL : AUTH_URL;

  let isError = false;
  const details = await fetch(authUrl + "?" + params.toString())
    .then((res) => res.json() as Promise<{ access_token: string; token_type: string }>)
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
