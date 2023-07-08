import { z } from "zod";

export const responseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

const client_id = z.string().min(1, "Client ID must be at least 1 character");
const reference_type = z.string().min(1, "Reference type must be at least 1 character");
const reference_id = z.string().min(1, "Reference ID must be at least 1 character");
const environmentSchema = z.enum(["liquidweb-prod-1", "liquidweb-qa-1"]);
export type ServerSupportedClientEnvironments = z.infer<typeof environmentSchema>;

export const tokenRequestSchema = z.object({
  client_id,
  reference_type,
  reference_id,
  environment: environmentSchema,
});

export const requestCompletionSchema = z.object({
  client_id,
  reference_type,
  reference_id,
  environment: environmentSchema,
  status: z.string(),
  customer_id: z.string(),
});

export function formatZodErrors(errors: z.ZodIssue[]): string {
  const errorMessages = errors.map((issue) => `${issue.path}: ${issue.message}`);
  return `Errors: | ${errorMessages.join(" | ")}`;
}

export function getAuthProperties(environment: ServerSupportedClientEnvironments) {
  switch (environment) {
    case "liquidweb-prod-1":
      const AUTH_URL = "https://auth.appnavotar.com/connect/token";
      const CLIENT_ID = process.env.V3_CLIENT_ID;
      const CLIENT_SECRET = process.env.V3_CLIENT_SECRET;
      if (!CLIENT_ID || !CLIENT_SECRET) {
        throw new Error(`Missing V3_CLIENT_ID, or V3_CLIENT_SECRET for ${environment} environment`);
      }
      return {
        AUTH_URL,
        CLIENT_ID,
        CLIENT_SECRET,
      } as const;
    case "liquidweb-qa-1":
      const QA_AUTH_URL = "https://testauth.appnavotar.com/connect/token";
      const QA_CLIENT_ID = process.env.QA_V3_CLIENT_ID;
      const QA_CLIENT_SECRET = process.env.QA_V3_CLIENT_SECRET;
      if (!QA_CLIENT_ID || !QA_CLIENT_SECRET) {
        throw new Error(`Missing QA_V3_CLIENT_ID, or QA_V3_CLIENT_SECRET for ${environment} environment`);
      }
      return {
        AUTH_URL: QA_AUTH_URL,
        CLIENT_ID: QA_CLIENT_ID,
        CLIENT_SECRET: QA_CLIENT_SECRET,
      } as const;
    default:
      throw new Error("Invalid environment");
  }
}
