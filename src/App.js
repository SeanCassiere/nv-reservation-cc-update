import React from "react";
import { Container } from "react-bootstrap";

import QueryStringNotPassed from "./layouts/QueryStringNotPasses";
import UserApplicationForm from "./layouts/UserApplicationForm";

const queryReservationId = new URLSearchParams(window.location.search).get("reservationId");
const queryClientId = new URLSearchParams(window.location.search).get("clientId");

const App = () => {
	return (
		<Container>
			{queryClientId !== null &&
			queryReservationId !== null &&
			queryClientId.length !== 0 &&
			queryReservationId.length !== 0 ? (
				<UserApplicationForm clientId={queryClientId} reservationId={queryReservationId} />
			) : (
				<QueryStringNotPassed />
			)}
		</Container>
	);
};

export default App;
