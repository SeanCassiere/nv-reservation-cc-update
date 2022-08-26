import { clientFetch } from "./clientV3";

type SystemUser = {
  clientId: number;
  userID: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  fullName: null;
  email: string | null;
  userRoleID: number;
  language: null;
  roleName: "Admin";
  locationName: string | null;
  lastLogin: string | null;
  isReservationEmail: boolean;
  isActive: true;
  phone: string | null;
  scanAccessKey: string | null;
  languageName: string | null;
  lockOut: boolean;
  locationList: null;
  userIdV3: string | null;
  overrideDateFormat: string | null;
  overrideTimeFormat: string | null;
};

export async function fetchAdminUser(clientId: string | number) {
  const params = new URLSearchParams();
  params.append("clientId", `${clientId}`);

  try {
    const users = (await clientFetch("/Users?" + params).then((r) => r.json())) as SystemUser[];
    const adminUserIdToUse = users.filter((u) => u.userRoleID === 1);
    if (adminUserIdToUse.length === 0) {
      throw new Error("No admin user found");
    }
    return adminUserIdToUse[0];
  } catch (error) {
    throw new Error("No admin user found");
  }
}
