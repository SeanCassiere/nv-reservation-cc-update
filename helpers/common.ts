import { z } from "zod";

const ClientIdSchema = z.string().min(1, "Client ID must be at least 1 character");
const ReferenceTypeSchema = z.string().min(1, "Reference type must be at least 1 character");
const ReferenceIdSchema = z.string().min(1, "Reference ID must be at least 1 character");
const EnvironmentEnumSchema = z.enum(["liquidweb-prod-1", "liquidweb-qa-1"]);
export type SupportedEnvironments = z.infer<typeof EnvironmentEnumSchema>;

export const GetTokenRequestSchema = z.object({
  client_id: ClientIdSchema,
  reference_type: ReferenceTypeSchema,
  reference_id: ReferenceIdSchema,
  environment: EnvironmentEnumSchema,
});

export const SubmissionCompletedRequestSchema = z.object({
  client_id: ClientIdSchema,
  reference_type: ReferenceTypeSchema,
  reference_id: ReferenceIdSchema,
  environment: EnvironmentEnumSchema,
  status: z.string(),
  customer_id: z.string(),
});

export const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string(),
});

export function formatZodErrors(errors: z.ZodIssue[]): string {
  const errorMessages = errors.map((issue) => `${issue.path}: ${issue.message}`);
  return `Errors: | ${errorMessages.join(" | ")}`;
}

export function makeXFormUrlEncodedBody(body: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(body)) {
    params.append(key, value);
  }
  return params.toString();
}

export const ResponseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};
