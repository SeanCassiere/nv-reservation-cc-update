import { useRuntimeStore } from "../hooks/stores/useRuntimeStore";

const AUTH_URL = "/api/token";
export const SUBMISSION_COMPLETION_URL = "/api/complete";

export async function authenticateWithLambda(opts: { clientId: string; qa: boolean }) {
  const { referenceType, referenceIdentifier, responseTemplateId } = useRuntimeStore.getState();
  const STATIC_PARAMS =
    "client_id=" + opts.clientId + "&reference_type=" + referenceType + "&reference_id=" + referenceIdentifier;

  let auth_url = AUTH_URL;

  if (opts.qa) {
    auth_url += `?qa=true&${STATIC_PARAMS}`;
  } else {
    auth_url += `?${STATIC_PARAMS}`;
  }

  const details = await fetch(auth_url).then(
    (res) => res.json() as Promise<{ access_token: string; token_type: string }>
  );

  return { ...details, clientId: opts.clientId, referenceType, referenceIdentifier, responseTemplateId };
}
