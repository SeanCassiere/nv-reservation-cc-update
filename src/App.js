import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import QueryStringNotPassed from "./layouts/QueryStringNotPasses";
import UserApplicationForm from "./layouts/UserApplicationForm";
import translate from "./utils/translations.json";

const queryReservationId = new URLSearchParams(window.location.search).get("reservationId");
const queryClientId = new URLSearchParams(window.location.search).get("clientId");

let queryLang = new URLSearchParams(window.location.search).get("lang") || "en";
if (translate[queryLang] === undefined) queryLang = "en";

const App = () => {
	return (
		<Container>
			<Row className='justify-content-lg-center' style={{ paddingTop: "1rem" }}>
				<Col xs={12} sm={12} md={12} lg={6}>
					<div style={{ margin: "0 auto" }}>
						{queryClientId !== null &&
						queryReservationId !== null &&
						queryClientId.length !== 0 &&
						queryReservationId.length !== 0 ? (
							<UserApplicationForm
								clientId={queryClientId}
								reservationId={queryReservationId}
								lang={queryLang}
								translate={translate}
							/>
						) : (
							<QueryStringNotPassed lang={queryLang} translate={translate} />
						)}
					</div>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<p style={{ padding: "1rem 0" }} className='text-center'>
						{translate[queryLang].footer.powered_by}&nbsp;
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
