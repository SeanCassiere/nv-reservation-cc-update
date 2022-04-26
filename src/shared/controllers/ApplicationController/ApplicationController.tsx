import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import ErrorSubmission from "../../pages/ErrorSubmission/ErrorSubmission";
import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";

import { setConfigValues, setLang, setRawConfig, setReferenceType } from "../../redux/slices/config/slice";
import { setInitialReferenceId } from "../../redux/slices/retrievedDetails/slice";
import { selectConfigState } from "../../redux/store";
import { initializeAppThunk } from "../../redux/slices/config/thunks";

import DisplayCurrentController from "./DisplayCurrentController";
import { APP_CONSTANTS } from "../../utils/constants";
import { isValueTrue } from "../../utils/common";

type ConfigState = {
	clientId: string | null;
	emailTemplateId: string | null;
	flow: string[];
	fromRentall: boolean;
};

const ApplicationController = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const appConfig = useSelector(selectConfigState);
	const { t } = useTranslation();

	// initial app boot
	useEffect(() => {
		const query = new URLSearchParams(window.location.search);

		const lang = query.get("lang");
		dispatch(setLang({ lang: lang as any }));

		let findingRefsMissing = false;

		let reservationId = query.get("reservationId");
		let agreementId = query.get("agreementId");

		findingRefsMissing = Boolean(reservationId || agreementId);
		if (!findingRefsMissing) {
			return navigate("/not-available");
		}

		const configQuery = query.get("config");
		const qaQuery = query.get("qa");

		let config: ConfigState = {
			clientId: null,
			emailTemplateId: null,
			flow: [],
			fromRentall: true,
		};
		if (configQuery) {
			dispatch(setRawConfig({ rawConfig: configQuery, rawQueryString: window.location.search }));
			const readConfig = JSON.parse(Buffer.from(configQuery, "base64").toString("ascii"));
			config = { ...config, ...readConfig };
		}

		if (!config.clientId || !config.emailTemplateId) return navigate("/not-available");

		dispatch(
			setConfigValues({
				clientId: config.clientId,
				responseTemplateId: config.emailTemplateId,
				flow: config.flow,
				fromRentall: config.fromRentall,
				qa: isValueTrue(qaQuery) ? true : false,
			})
		);

		if (reservationId) {
			dispatch(setReferenceType({ referenceType: APP_CONSTANTS.REF_TYPE_RESERVATION }));
			dispatch(setInitialReferenceId(reservationId));
		} else if (agreementId) {
			dispatch(setReferenceType({ referenceType: APP_CONSTANTS.REF_TYPE_AGREEMENT }));
			dispatch(setInitialReferenceId(agreementId));
		}

		dispatch(initializeAppThunk());
	}, [dispatch, navigate]);

	/*
	 ** Application Controller management
	 */
	const [previousControllers, setPreviousControllers] = useState<string[]>([]);
	const [activeController, setActiveController] = useState<string | null>(null);
	const [remainingFlowControllers, setRemainingFlowControllers] = useState<string[]>([]);

	const isPrevPageAvailable = useMemo(() => previousControllers.length > 0, [previousControllers]);
	const handlePrevious = useCallback(() => {
		if (previousControllers.length <= 0) return;

		const currentPrevScreens = previousControllers;
		const currentScreen = activeController!;

		const newActiveScreen = currentPrevScreens.pop() || appConfig.flow[0];

		setActiveController(newActiveScreen);
		setPreviousControllers(currentPrevScreens.filter((screen) => screen !== newActiveScreen));
		setRemainingFlowControllers([currentScreen, ...remainingFlowControllers]);
	}, [activeController, appConfig.flow, previousControllers, remainingFlowControllers]);

	const isNextPageAvailable = useMemo(() => remainingFlowControllers.length > 0, [remainingFlowControllers]);
	const handleSubmit = useCallback(() => {
		if (remainingFlowControllers.length <= 0) {
			// navigate to a protected page with a submission controller
			return navigate("/submit-details", { replace: true });
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
			{appConfig.status === "authenticating" && <LoadingSubmission title={t("authenticationSubmission.title")} />}
			{appConfig.status === "authentication_error" && (
				<ErrorSubmission msg={t("authenticationSubmission.message")} tryAgainButton />
			)}
			{appConfig.status === "reservation_fetch_failed" && (
				<ErrorSubmission
					msg={t("reservationFetchError.message", {
						context: appConfig.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
					})}
					tryAgainButton
				/>
			)}
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
