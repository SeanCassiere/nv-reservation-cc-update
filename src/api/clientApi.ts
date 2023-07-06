import { z } from "zod";

import { clientFetch } from "./clientV3";

const systemUserSchema = z.object({
  currency: z.string().default("USD"),
});

export type FetchClientProfile = z.infer<typeof systemUserSchema>;

export async function fetchClientProfile({ clientId }: { clientId: string | number }) {
  return await clientFetch(`/Clients/${clientId}`)
    .then((r) => r.json())
    .then((data) => systemUserSchema.parse(data));
}
