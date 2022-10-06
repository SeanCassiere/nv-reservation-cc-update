import { clientFetch } from "./clientV3";

export type RentalSourcedDetails = {
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

const fetchReservationById = async (opts: FetchReservationByIdOrNumberProps): Promise<RentalSourcedDetails | null> => {
  try {
    const params = new URLSearchParams();
    params.append("ClientId", `${opts.clientId}`);
    const res = await clientFetch(`/Reservations/${opts.referenceId}?` + params).then((r) => r.json());

    const reservationInfo: RentalSourcedDetails = {
      locationId: res.reservationview?.startLocationId ?? 0,
      customerId: res.reservationview?.customerId ?? 0,
      customerEmail: res.reservationview?.email ?? "",
      locationEmail: res.reservationview?.locationEmail ?? "",
      referenceNo: res.reservationview?.reservationNumber ?? "",
      referenceId: Number(res.reservationview?.reserveId) ?? 0,
      driverId: res.driverList[0]?.driverId ?? res.customerDetails?.customerId,
      driverName: `${res.customerDetails?.firstName ?? ""} ${res.customerDetails?.lastName ?? ""}`,
      isCheckIn: false,
    };
    return reservationInfo;
  } catch (error) {
    return null;
  }
};

const fetchReservationsByNumber = async (
  opts: FetchReservationByIdOrNumberProps
): Promise<{ ReserveId: number; ReservationNumber: string } | null> => {
  try {
    const params = new URLSearchParams();
    params.append("ReservationNumber", `${opts.referenceId}`);
    params.append("clientId", `${opts.clientId}`);
    params.append("userId", `0`);
    const list = await clientFetch(`/Reservations?` + params).then((r) => r.json());
    const findReservation = list.find(
      (r: { ReserveId: number; ReservationNumber: string }) => r.ReservationNumber === opts.referenceId
    );

    if (!findReservation) {
      throw new Error("Not found");
    }
    return findReservation;
  } catch (error) {
    return null;
  }
};

type FetchReservationByIdOrNumberProps = { clientId: string; referenceId: string };

export async function fetchReservationByIdOrNumberProcedure(
  opts: FetchReservationByIdOrNumberProps
): Promise<RentalSourcedDetails> {
  const initialSearchById = await fetchReservationById(opts);

  // if found on first try, then return
  if (initialSearchById) return initialSearchById;

  // try finding by the number, if not found throw
  const searchByNumber = await fetchReservationsByNumber(opts);
  if (!searchByNumber) throw new Error("Reservation not found");

  // try finding by the id again, if not found throw
  const secondSearchById = await fetchReservationById({ ...opts, referenceId: String(searchByNumber.ReserveId) });
  if (!secondSearchById) throw new Error("Reservation not found");

  return secondSearchById;
}
