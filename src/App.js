import QueryStringNotPassed from "./layouts/QueryStringNotPasses";
import UserApplicationForm from "./layouts/UserApplicationForm";

const queryReservationId = new URLSearchParams(window.location.search).get("reservationId");
const queryClientId = new URLSearchParams(window.location.search).get("clientId");

const App = () => {
	return (
		<>
			{queryClientId !== null &&
			queryReservationId !== null &&
			queryClientId.length !== 0 &&
			queryReservationId.length !== 0 ? (
				<UserApplicationForm clientId={queryClientId} reservationId={queryReservationId} />
			) : (
				<QueryStringNotPassed />
			)}
		</>
	);
};

export default App;
