import { clientFetch } from "./clientV3";
import { RentalSourcedDetails } from "./reservationApi";

const checkInIds = [3, 5, 7];

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
