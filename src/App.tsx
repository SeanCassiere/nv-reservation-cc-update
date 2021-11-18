import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";

import AppRoutes from "./routes/AppRoutes";
import { selectTranslations } from "./shared/redux/store";
import ErrorSubmission from "./shared/pages/ErrorSubmission/ErrorSubmission";

const App = () => {
	const t = useSelector(selectTranslations);

	return (
		<Container>
			<Row className='justify-content-lg-center' style={{ paddingTop: "1rem" }}>
				<Col xs={12} sm={12} md={12} lg={6}>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<AppRoutes />
					</ErrorBoundary>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<p style={{ padding: "1rem 0" }} className='text-center'>
						{t.footer.powered_by}&nbsp;
						<a href='https://navotar.com' target='_blank' rel='noreferrer' className='text-primary'>
							Navotar
						</a>
					</p>
				</Col>
			</Row>
		</Container>
	);
};

const ErrorFallback = () => {
	return <ErrorSubmission msg={"The application encountered a fatal error."} />;
};

export default App;
