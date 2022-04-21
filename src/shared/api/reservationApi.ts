import clientV3 from "./clientV3";

type ReservationSourcedDetails = {
	locationId: number;
	customerId: number;
	referenceId: number;
	customerEmail: string;
	referenceNo: string;
	locationEmail: string;
	driverId: number;
	driverName: string;
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
				referenceNo: res.data.reservationview.reservationNumber,
				referenceId: Number(res.data.reservationview.reserveId),
				driverId: Number(res.data.driverList[0].driverId),
				driverName: `${res.data.customerDetails?.firstName ?? ""} ${res.data.customerDetails?.lastName ?? ""}`,
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
