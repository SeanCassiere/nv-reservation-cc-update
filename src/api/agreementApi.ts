import clientV3, { clientFetch } from "./clientV3";
import { RentalSourcedDetails } from "./reservationApi";

const checkInIds = [3, 5, 7];

export const getAgreementByIdOrNumber = async (
  clientId: any,
  referenceNo: any,
  referenceId: any,
  systemUserId: any
): Promise<RentalSourcedDetails | null> => {
  let isSearching = true;
  let agreementId = referenceId;
  let agreementSourcedDetails: RentalSourcedDetails | null = null;

  while (isSearching) {
    // get agreement details by id
    try {
      const res = await clientV3.get(`/Agreements/${agreementId}`, {
        params: {
          ClientId: clientId,
        },
      });

      const agreementInfo = {
        locationId: res.data.checkoutLocation,
        customerId: res.data.customerId,
        customerEmail: res.data.email,
        locationEmail: res.data.checkoutLocationEmail,
        referenceNo: res.data.agreementNumber,
        referenceId: Number(res.data.agreementId),
        driverId: Number(res.data.driverList[0]?.driverId) ?? res.data.customerId,
        driverName: `${res.data.firstName ?? ""} ${res.data.lastName ?? ""}`,
        isCheckIn: checkInIds.includes(res.data?.agreementStatusId ?? 0),
      };

      agreementSourcedDetails = agreementInfo;
      console.log("found agreement");
      isSearching = false;
    } catch (error) {
      console.error("could not find from GET /agreements/:id", error);
    }

    if (!isSearching) break;
    console.log({ currentReferenceNo: referenceNo, currentReferenceId: referenceId });

    // find the reservation by reservation number
    try {
      if (systemUserId === 0) {
        console.warn("systemUserId is 0, therefore /agreements?AgreementNumber=:referenceNo will not work");
      }

      const res = await clientV3(`/Agreements`, {
        params: { AgreementNumber: referenceNo, clientId: clientId, userId: systemUserId },
      });

      const list = res.data;
      const findAgreement = list.find(
        (r: { AgreementId: number; AgreementNumber: string }) =>
          r.AgreementNumber.toLowerCase() === String(referenceNo).toLowerCase()
      );

      if (!findAgreement) {
        console.error("could not find from GET /agreements?AgreementNumber=XXX");
        isSearching = false;
      } else {
        agreementId = findAgreement.AgreementId;
        isSearching = true;
      }
    } catch (error) {
      console.error("error finding from GET /agreements?AgreementNumber=XXX", error);
      isSearching = false;
    }

    if (!isSearching) break;
  }

  // return null if no agreement found
  if (!agreementSourcedDetails) {
    return null;
  }

  return agreementSourcedDetails;
};

export async function fetchAgreementByIdOrNumber(opts: { clientId: string; referenceId: string; adminUserId: number }) {
  let isSearching = true;
  let agreementId = opts.referenceId;
  let agreementSourcedDetails: RentalSourcedDetails | null = null;

  while (isSearching) {
    // get agreement details by id
    try {
      const params = new URLSearchParams();
      params.append("ClientId", `${opts.clientId}`);
      const res = await clientFetch(`/Agreements/${agreementId}?` + params).then((r) => r.json());

      const agreementInfo = {
        locationId: res.checkoutLocation,
        customerId: res.customerId,
        customerEmail: res.email,
        locationEmail: res.checkoutLocationEmail,
        referenceNo: res.agreementNumber,
        referenceId: Number(res.agreementId),
        driverId: Number(res.driverList[0]?.driverId) ?? res.customerId,
        driverName: `${res.firstName ?? ""} ${res.lastName ?? ""}`,
        isCheckIn: checkInIds.includes(res?.agreementStatusId ?? 0),
      };

      agreementSourcedDetails = agreementInfo;
      isSearching = false;
    } catch (error) {}

    if (!isSearching) break;

    // find the reservation by reservation number
    try {
      if (!opts.adminUserId) {
        console.warn("systemUserId is 0, therefore /agreements?AgreementNumber=:referenceNo will not work");
      }

      const params = new URLSearchParams();
      params.append("AgreementNumber", `${opts.referenceId}`);
      params.append("clientId", `${opts.clientId}`);
      params.append("userId", `${opts.adminUserId}`);
      const list = await clientFetch(`/Agreements?` + params).then((r) => r.json());
      const findAgreement = list.find(
        (r: { AgreementId: number; AgreementNumber: string }) =>
          r.AgreementNumber.toLowerCase() === String(opts.referenceId).toLowerCase()
      );

      if (!findAgreement) {
        isSearching = false;
      } else {
        agreementId = findAgreement.AgreementId;
        isSearching = true;
      }
    } catch (error) {
      isSearching = false;
    }

    if (!isSearching) break;
  }

  // return null if no agreement found
  if (!agreementSourcedDetails) {
    throw new Error("Agreement not found");
  }

  return agreementSourcedDetails;
}
