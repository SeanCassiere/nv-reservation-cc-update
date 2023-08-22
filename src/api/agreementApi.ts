import { z } from "zod";

import { clientFetch } from "./clientV3";
import { RentalSourcedDetails } from "./reservationApi";

const checkInIds = [3, 5, 7];

type FetchAgreementByIdOrNumberProps = {
  clientId: string;
  referenceId: string;
  adminUserId: number;
};

const fetchAgreementById = async (opts: FetchAgreementByIdOrNumberProps): Promise<RentalSourcedDetails | null> => {
  try {
    const params = new URLSearchParams();
    params.append("ClientId", `${opts.clientId}`);
    const res = await clientFetch(`/api/v3/agreements/${opts.referenceId}?` + params).then((r) => r.json());

    const agreementInfo: RentalSourcedDetails = {
      locationId: res?.checkoutLocation ?? 0,
      customerId: res?.customerId ?? 0,
      customerEmail: res?.email ?? "",
      locationEmail: res?.checkoutLocationEmail ?? "",
      referenceNo: res?.agreementNumber ?? "",
      referenceId: Number(res?.agreementId),
      driverId: Number(res?.driverList[0]?.driverId) ?? res?.customerId,
      driverName: `${res?.firstName ?? ""} ${res?.lastName ?? ""}`,
      isCheckIn: checkInIds.includes(res?.agreementStatusId ?? 0),
    };
    return agreementInfo;
  } catch (error) {
    return null;
  }
};

const fetchAgreementsByNumber = async (opts: FetchAgreementByIdOrNumberProps) => {
  try {
    if (!opts.adminUserId) {
      console.warn("systemUserId is 0, therefore /agreements?AgreementNumber=:referenceNo will not work");
    }

    const params = new URLSearchParams();
    params.append("AgreementNumber", `${opts.referenceId}`);
    params.append("clientId", `${opts.clientId}`);
    params.append("userId", `${opts.adminUserId}`);
    const list = await clientFetch(`/api/v3/agreements?` + params).then((r) => r.json());

    const parsedList = z
      .array(z.object({ AgreementId: z.number(), AgreementNumber: z.string() }))
      .parse(Array.isArray(list) ? list : []);

    const findAgreement = parsedList.find(
      (r) => r.AgreementNumber.toLowerCase() === String(opts.referenceId).toLowerCase(),
    );
    if (!findAgreement) {
      throw new Error("Not found");
    }
    return findAgreement;
  } catch (error) {
    return null;
  }
};

export async function fetchAgreementByIdOrNumberProcedure(
  opts: FetchAgreementByIdOrNumberProps,
): Promise<RentalSourcedDetails> {
  const initialSearchById = await fetchAgreementById(opts);

  // if found on first try, then return
  if (initialSearchById) return initialSearchById;

  // try finding by the number, if not found throw
  const searchByNumber = await fetchAgreementsByNumber(opts);
  if (!searchByNumber) throw new Error("Agreement not found");

  // try finding by the id again, if not found throw
  const secondSearchById = await fetchAgreementById({ ...opts, referenceId: String(searchByNumber.AgreementId) });
  if (!secondSearchById) throw new Error("Agreement not found");

  return secondSearchById;
}
