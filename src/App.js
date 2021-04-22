import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import QueryStringNotPassed from "./layouts/QueryStringNotPassed";
import MainApplicationController from "./controllers/MainApplicationController";
import translate from "./utils/translations.json";

const URL_APP_CONFIG = new URLSearchParams(window.location.search).get("config");
const URL_RESERVATION_ID = new URLSearchParams(window.location.search).get("reservationId");
const URL_LANG = new URLSearchParams(window.location.search).get("lang") || "en";

let CONFIG_JSON = { clientId: null };
if (URL_APP_CONFIG !== null) CONFIG_JSON = JSON.parse(Buffer.from(URL_APP_CONFIG, "base64").toString("ascii"));

const queryClientId = CONFIG_JSON.clientId;

let queryLang = URL_LANG.toLowerCase();
if (translate[queryLang] === undefined) queryLang = "en";

const App = () => {
	return (
		<Container>
			<Row className='justify-content-lg-center' style={{ paddingTop: "1rem" }}>
				<Col xs={12} sm={12} md={12} lg={6}>
					<div style={{ margin: "0 auto" }}>
						{queryClientId !== null && URL_RESERVATION_ID !== null && URL_RESERVATION_ID.length !== 0 ? (
							<MainApplicationController
								clientId={queryClientId}
								reservationId={URL_RESERVATION_ID}
								lang={queryLang}
								translate={translate}
							/>
						) : (
							<QueryStringNotPassed lang={queryLang} />
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
