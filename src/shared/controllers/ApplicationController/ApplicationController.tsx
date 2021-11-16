import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ErrorSubmission from "../../pages/ErrorSubmission/ErrorSubmission";
import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";
import { setConfigValues, setLang } from "../../redux/slices/config";
import { setReservationId } from "../../redux/slices/reservation";
import { selectConfigState, selectTranslations } from "../../redux/store";
import { authenticateAppThunk } from "../../redux/thunks/configThunks";

import DisplayCurrentController from "./DisplayCurrentController";

const ApplicationController = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const appConfig = useSelector(selectConfigState);
	const t = useSelector(selectTranslations);

	// initial app boot
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const reservationId = query.get("reservationId");

		if (!reservationId) return navigate("/not-available");

		const lang = query.get("lang");
		const configQuery = query.get("config");

		let config: { clientId: string | null; emailTemplateId: string | null; flows: string[] } = {
			clientId: null,
			emailTemplateId: null,
			flows: [],
		};
		if (configQuery) {
			config = JSON.parse(Buffer.from(configQuery, "base64").toString("ascii"));
		}

		if (!config.clientId || !config.emailTemplateId) return navigate("/not-available");

		dispatch(setLang({ lang: lang as any }));
		dispatch(
			setConfigValues({ clientId: config.clientId, responseTemplateId: config.emailTemplateId, flows: config.flows })
		);
		dispatch(setReservationId(reservationId));
		dispatch(authenticateAppThunk());
	}, [dispatch, navigate]);

	/*
	 ** Application Controller management
	 */
	const [remainingFlowControllers, setRemainingFlowControllers] = useState<string[]>([]);
	const [currentController, setCurrentController] = useState<string | null>(null);

	const isNextPageAvailable = useCallback(() => remainingFlowControllers.length > 0, [remainingFlowControllers]);

	const handleSubmit = useCallback(() => {
		const nextPage = remainingFlowControllers[0];

		let remainingElements = remainingFlowControllers.filter((elem) => elem !== currentController);
		remainingElements = remainingElements.filter((elem) => elem !== nextPage);

		setRemainingFlowControllers(remainingElements);
		setCurrentController(nextPage);

		if (remainingFlowControllers.length === 0) {
			// navigate to a protected page with a submission controller
			return navigate("/submit-details");
		}
	}, [navigate, currentController, remainingFlowControllers]);

	useEffect(() => {
		const startingController = appConfig.flow[0];
		// Removing the starting controller since it will automatically be shown
		const startingControllers = appConfig.flow.filter((elem) => elem !== startingController);

		setRemainingFlowControllers(startingControllers);
		setCurrentController(startingController);
	}, [appConfig.flow]);

	return (
		<>
			{appConfig.status === "authenticating" && <LoadingSubmission title={t.authentication_submission.title} />}
			{appConfig.status === "authentication_error" && <ErrorSubmission msg={t.authentication_submission.message} />}
			{appConfig.status === "loaded" && (
				<DisplayCurrentController
					selectedController={currentController}
					handleNext={handleSubmit}
					isNextPageAvailable={isNextPageAvailable}
				/>
			)}
		</>
	);
};

export default ApplicationController;
