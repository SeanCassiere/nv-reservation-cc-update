import { clientFetch } from "./clientV3";

export type FetchClientProfile = {
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientCountry: string;
  clientZipCode: string;
  clienPhoneNo: string;
  clientEmail: string;
  address: string;
  clientContactName: string;
  currency: string;
  maxVehiclesReached: boolean;
  isActive: boolean;
};

export async function fetchClientProfile({ clientId }: { clientId: string | number }): Promise<FetchClientProfile> {
  return await clientFetch(`/Clients/${clientId}`).then((r) => r.json());
}
