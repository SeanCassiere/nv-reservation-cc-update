import QueryStringNotPassed from "./layouts/QueryStringNotPasses";
import CreditCardForm from "./layouts/CreditCardForm";

const queryReservationId = new URLSearchParams(window.location.search).get("reservationId");
const queryClientId = new URLSearchParams(window.location.search).get("clientId");

const App = () => {
	return (
		<>
			{queryClientId !== null &&
			queryReservationId !== null &&
			queryClientId.length !== 0 &&
			queryReservationId.length !== 0 ? (
				<CreditCardForm clientId={queryClientId} reservationId={queryReservationId} />
			) : (
				<QueryStringNotPassed />
			)}
		</>
	);
};

export default App;
