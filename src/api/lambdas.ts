import { useRuntimeStore } from "../hooks/stores/useRuntimeStore";

const AUTH_URL = "/api/token";
const SUBMISSION_COMPLETION_URL = "/api/complete";

export async function authenticateWithLambda(opts: { clientId: string; qa: boolean }) {
  const { referenceType, referenceIdentifier, responseTemplateId } = useRuntimeStore.getState();

  const params = new URLSearchParams();
  if (opts.qa) {
    params.append("qa", "true");
  }
  params.append("client_id", `${opts.clientId}`);
  params.append("reference_type", `${referenceType}`);
  params.append("reference_id", `${referenceIdentifier}`);

  const details = await fetch(AUTH_URL + "?" + params.toString()).then(
    (res) => res.json() as Promise<{ access_token: string; token_type: string }>
  );

  return { ...details, clientId: opts.clientId, referenceType, referenceIdentifier, responseTemplateId };
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
