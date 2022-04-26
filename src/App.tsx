import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import AppRoutes from "./routes/AppRoutes";
import ErrorSubmission from "./shared/pages/ErrorSubmission/ErrorSubmission";

import DeveloperDebugDrawer from "./shared/components/DeveloperDebugDrawer/DeveloperDebugDrawer";

import { selectConfigState } from "./shared/redux/store";
import { isValueTrue } from "./shared/utils/common";

const App = () => {
	const { t } = useTranslation();
	const { fromRentall } = useSelector(selectConfigState);

	// developer menu
	const [isDeveloperDrawerOpen, setIsDeveloperDrawerOpen] = React.useState(false);
	const handleCloseDeveloperDrawer = () => setIsDeveloperDrawerOpen(false);
	React.useEffect(() => {
		function onKeyDown(evt: KeyboardEvent) {
			if (evt.key === "k" && evt.shiftKey && (evt.metaKey || evt.ctrlKey)) {
				setIsDeveloperDrawerOpen((v) => !v);
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);
	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const dev = query.get("dev");
		const isDevOpen = Boolean(isValueTrue(dev));
		if (isDevOpen) {
			setIsDeveloperDrawerOpen(true);
		}
	}, []);

	return (
		<Container>
			<Row className='justify-content-lg-center' style={{ paddingTop: "1rem" }}>
				<Col xs={12} sm={12} md={12} lg={6}>
					<ErrorBoundary FallbackComponent={ErrorFallback}>
						<DeveloperDebugDrawer open={isDeveloperDrawerOpen} handleClose={handleCloseDeveloperDrawer} />
						<AppRoutes />
					</ErrorBoundary>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12}>
					<p style={{ padding: "1rem 0" }} className='text-center'>
						{t("footer.poweredBy")}&nbsp;
						<a
							href={fromRentall ? "https://rentallsoftware.com" : "https://navotar.com"}
							target='_blank'
							rel='noreferrer'
							className='text-primary'
						>
							{fromRentall ? "RENTALL" : "Navotar"}
						</a>
					</p>
				</Col>
			</Row>
		</Container>
	);
};

const ErrorFallback = () => {
	const { t } = useTranslation();
	return <ErrorSubmission msg={t("errorBoundary.message")} />;
};

export default App;
