// import store, { RootState } from "../redux/store";

import clientV3 from "./clientV3";

type ReservationSourcedDetails = {
	locationId: number;
	customerId: number;
	reservationId: number;
	customerEmail: string;
	reservationNo: string;
	locationEmail: string;
};

export const getReservationByIdOrNumber = async (
	clientId: any,
	referenceNo: any,
	referenceId: any
): Promise<ReservationSourcedDetails | null> => {
	let isSearching = true;
	let reservationId = referenceId;
	let reservationSourcedDetails: ReservationSourcedDetails | null = null;

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
				reservationNo: res.data.reservationview.reservationNumber,
				reservationId: Number(res.data.reservationview.reserveId),
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
