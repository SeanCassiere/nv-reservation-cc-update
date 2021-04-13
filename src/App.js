import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import QueryStringNotPassed from "./layouts/QueryStringNotPasses";
import UserApplicationForm from "./layouts/UserApplicationForm";

const queryReservationId = new URLSearchParams(window.location.search).get("reservationId");
const queryClientId = new URLSearchParams(window.location.search).get("clientId");

const App = () => {
	return (
		<Container>
			<Row className='justify-content-lg-center' style={{ paddingTop: "1rem" }}>
				<Col xs={12} sm={12} md={4} lg={4}>
					{queryClientId !== null &&
					queryReservationId !== null &&
					queryClientId.length !== 0 &&
					queryReservationId.length !== 0 ? (
						<UserApplicationForm clientId={queryClientId} reservationId={queryReservationId} />
					) : (
						<QueryStringNotPassed />
					)}
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<p style={{ padding: "1rem 0" }} className='text-center'>
						Powered by{" "}
						<a href='https://navotar.com' target='_blank' rel='noreferrer' className='text-primary'>
							Navotar
						</a>
					</p>
				</Col>
			</Row>
		</Container>
	);
};

export default App;
