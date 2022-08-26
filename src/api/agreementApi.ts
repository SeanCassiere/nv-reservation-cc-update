import clientV3 from "./clientV3";

type AgreementSourcedDetails = {
  locationId: number;
  customerId: number;
  referenceId: number;
  customerEmail: string;
  referenceNo: string;
  locationEmail: string;
  driverId: number;
  driverName: string;
  isCheckIn: boolean;
};

const checkInIds = [3, 5, 7];

export const getAgreementByIdOrNumber = async (
  clientId: any,
  referenceNo: any,
  referenceId: any,
  systemUserId: any
): Promise<AgreementSourcedDetails | null> => {
  let isSearching = true;
  let agreementId = referenceId;
  let agreementSourcedDetails: AgreementSourcedDetails | null = null;

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
