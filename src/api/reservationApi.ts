import clientV3, { clientFetch } from "./clientV3";

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

export const getReservationByIdOrNumber = async (
  clientId: any,
  referenceNo: any,
  referenceId: any
): Promise<RentalSourcedDetails | null> => {
  let isSearching = true;
  let reservationId = referenceId;
  let reservationSourcedDetails: RentalSourcedDetails | null = null;

  while (isSearching) {
    // get reservation details by id
    try {
      const res = await clientV3.get(`/Reservations/${reservationId}`, {
        params: {
          ClientId: clientId,
        },
      });

      const reservationInfo = {
        locationId: res.data.reservationview.startLocationId,
        customerId: res.data.reservationview.customerId,
        customerEmail: res.data.reservationview.email,
        locationEmail: res.data.reservationview.locationEmail,
        referenceNo: res.data.reservationview.reservationNumber,
        referenceId: Number(res.data.reservationview.reserveId),
        driverId: res.data.driverList[0]?.driverId ?? res.data.customerDetails?.customerId,
        driverName: `${res.data.customerDetails?.firstName ?? ""} ${res.data.customerDetails?.lastName ?? ""}`,
        isCheckIn: false,
      };

      // dispatch(setReservationDetails(reservationInfo));
      reservationSourcedDetails = reservationInfo;
      console.log("found reservation");
      isSearching = false;
    } catch (error) {
      console.error("could not find from GET /reservations/:id", error);
      console.groupEnd();
    }

    if (!isSearching) break;

    // find the reservation by reservation number
    try {
      const res = await clientV3(`/Reservations`, {
        params: { ReservationNumber: referenceNo, clientId: clientId, userId: 0 },
      });
      const list = res.data;
      const findReservation = list.find(
        (r: { ReserveId: number; ReservationNumber: string }) => r.ReservationNumber === referenceNo
      );

      if (!findReservation) {
        console.error("could not find from GET /reservations?ReservationNumber=XXX");
        isSearching = false;
      } else {
        reservationId = findReservation.ReserveId;
        isSearching = true;
      }
    } catch (error) {
      console.error("error finding from GET /reservations?ReservationNumber=XXX", error);
      isSearching = false;
    }

    if (!isSearching) break;
  }

  if (!reservationSourcedDetails) {
    return null;
  }

  return reservationSourcedDetails;
};

export async function fetchReservationByIdOrNumber(opts: { clientId: string; referenceId: string }) {
  let isSearching = true;
  let reservationId = opts.referenceId;
  let reservationSourcedDetails: RentalSourcedDetails | null = null;

  while (isSearching) {
    // get reservation details by id
    try {
      const params = new URLSearchParams();
      params.append("ClientId", `${opts.clientId}`);
      const res = await clientFetch(`/Reservations/${reservationId}?` + params).then((r) => r.json());

      const reservationInfo = {
        locationId: res.reservationview?.startLocationId,
        customerId: res.reservationview?.customerId,
        customerEmail: res.reservationview?.email,
        locationEmail: res.reservationview?.locationEmail,
        referenceNo: res.reservationview?.reservationNumber,
        referenceId: Number(res.reservationview?.reserveId),
        driverId: res.driverList[0]?.driverId ?? res.customerDetails?.customerId,
        driverName: `${res.customerDetails?.firstName ?? ""} ${res.customerDetails?.lastName ?? ""}`,
        isCheckIn: false,
      };

      reservationSourcedDetails = reservationInfo;
      isSearching = false;
    } catch (error) {
      console.log("there was an error", error);
    }

    if (isSearching === false) {
      break;
    }

    // find the reservation by reservation number
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
        isSearching = false;
      } else {
        reservationId = findReservation.ReserveId;
        isSearching = true;
      }
    } catch (error) {
      isSearching = false;
    }

    if (!isSearching) break;
  }

  if (!reservationSourcedDetails) {
    throw new Error("Reservation not found");
  }

  return reservationSourcedDetails;
}
