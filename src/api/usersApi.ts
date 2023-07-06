import { z } from "zod";

import { clientFetch } from "./clientV3";

const systemUserSchema = z.object({
  userRoleID: z.number().nullable(),
  userID: z.number(),
});

export async function fetchAdminUser(clientId: string | number) {
  const params = new URLSearchParams();
  params.append("clientId", `${clientId}`);

  try {
    const users = await clientFetch("/Users?" + params)
      .then((r) => r.json())
      .then((data) => z.array(systemUserSchema).parse(data ?? []));
    const adminUserIdToUse = users.filter((u) => u.userRoleID === 1);
    if (adminUserIdToUse.length === 0) {
      throw new Error("No admin user found");
    }
    return adminUserIdToUse[0];
  } catch (error) {
    throw new Error("No admin user found");
  }
}
