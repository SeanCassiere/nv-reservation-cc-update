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

		let config: { clientId: string | null; emailTemplateId: string | null; flow: string[] } = {
			clientId: null,
			emailTemplateId: null,
			flow: [],
		};
		if (configQuery) {
			config = JSON.parse(Buffer.from(configQuery, "base64").toString("ascii"));
		}

		if (!config.clientId || !config.emailTemplateId) return navigate("/not-available");

		dispatch(setLang({ lang: lang as any }));
		dispatch(
			setConfigValues({ clientId: config.clientId, responseTemplateId: config.emailTemplateId, flow: config.flow })
		);
		dispatch(setReservationId(reservationId));
		dispatch(authenticateAppThunk());
	}, [dispatch, navigate]);

	/*
	 ** Application Controller management
	 */
	const [previousControllers, setPreviousControllers] = useState<string[]>([]);
	const [activeController, setActiveController] = useState<string | null>(null);
	const [remainingFlowControllers, setRemainingFlowControllers] = useState<string[]>([]);

	const isPrevPageAvailable = useCallback(() => previousControllers.length > 0, [previousControllers]);
	const handlePrevious = useCallback(() => {
		if (previousControllers.length <= 0) return;

		const currentPrevScreens = previousControllers;
		const currentScreen = activeController!;

		const newActiveScreen = currentPrevScreens.pop() || appConfig.flow[0];

		setActiveController(newActiveScreen);
		setPreviousControllers(currentPrevScreens.filter((screen) => screen !== newActiveScreen));
		setRemainingFlowControllers([currentScreen, ...remainingFlowControllers]);
	}, [activeController, appConfig.flow, previousControllers, remainingFlowControllers]);

	const isNextPageAvailable = useCallback(() => remainingFlowControllers.length > 0, [remainingFlowControllers]);
	const handleSubmit = useCallback(() => {
		if (remainingFlowControllers.length <= 0) {
			// navigate to a protected page with a submission controller
			return navigate("/submit-details");
		} else {
			const currentScreen = activeController!;
			const nextScreen = remainingFlowControllers[0];

			const newPreviousControllersList = [...previousControllers, currentScreen]; //correct

			const newFutureControllersList = remainingFlowControllers.filter((e) => e !== nextScreen);

			setPreviousControllers(newPreviousControllersList);
			setRemainingFlowControllers(newFutureControllersList);
			setActiveController(nextScreen);
		}
	}, [activeController, remainingFlowControllers, previousControllers, navigate]);

	useEffect(() => {
		const startingController = appConfig.flow[0];
		// Removing the starting controller since it will automatically be shown
		const startingControllers = appConfig.flow.filter((elem) => elem !== startingController);

		setRemainingFlowControllers(startingControllers);
		setActiveController(startingController);
	}, [appConfig.flow]);

	return (
		<>
			{appConfig.status === "authenticating" && <LoadingSubmission title={t.authentication_submission.title} />}
			{appConfig.status === "authentication_error" && <ErrorSubmission msg={t.authentication_submission.message} />}
			{appConfig.status === "loaded" && (
				<>
					<DisplayCurrentController
						selectedController={activeController}
						handleNext={handleSubmit}
						handlePrevious={handlePrevious}
						isPrevPageAvailable={isPrevPageAvailable}
						isNextPageAvailable={isNextPageAvailable}
					/>
				</>
			)}
		</>
	);
};

export default ApplicationController;
