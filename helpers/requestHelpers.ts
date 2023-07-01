import { z } from "zod";
export const containsKey = (rawQueryString: string, key: string): boolean => {
  return rawQueryString.indexOf(key) !== -1;
};

export const isValueTrue = (value: string | undefined | null | boolean): boolean => {
  if (!value) return false;
  return value &&
    ((typeof value === "string" && value.toLowerCase() === "true") ||
      (typeof value === "string" && value === "1") ||
      value === true)
    ? true
    : false;
};

export const responseHeaders = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const tokenRequestSchema = z.object({
  client_id: z.string().min(1, "Client ID must be at least 1 character"),
  reference_type: z.string().min(1, "Reference type must be at least 1 character"),
  reference_id: z.string().min(1, "Reference ID must be at least 1 character"),
});
