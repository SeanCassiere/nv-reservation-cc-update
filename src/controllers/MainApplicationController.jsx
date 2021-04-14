import React, { useState, useReducer } from "react";

import { updateCreditCardByCustomerId } from "../api/apiFunctions";
import { reducer, initialState } from "../utils/reducerLogic";
import { SUBMITTING_FORM_LOADING, SUBMITTING_FORM_SUCCESS, SUBMITTING_FORM_ERROR } from "../utils/reducerConstants";

import UserCreditCardController from "./UserCreditCardController";
import ErrorSubmission from "../layouts/ErrorSubmission";
import SuccessSubmission from "../layouts/SuccessSubmission";
import LoadingSubmission from "../layouts/LoadingSubmission";

const initialCreditCardInfo = {
	ccType: "",
	name: "",
	number: "",
	monthExpiry: "",
	yearExpiry: "",
	cvc: "",
	billingZip: "",
};

const MainApplicationController = ({ clientId, reservationId, lang, translate }) => {
	const [globalState, dispatch] = useReducer(reducer, initialState);
	const [ccData, setCCData] = useState(initialCreditCardInfo);

	function handleSubmit(e) {
		e.preventDefault();
		if (ccData.number.length < 16) return;
		dispatch({ type: SUBMITTING_FORM_LOADING });
		updateCreditCardByCustomerId(clientId, reservationId, ccData)
			.then(() => dispatch({ type: SUBMITTING_FORM_SUCCESS }))
			.catch((err) => {
				console.log(err);
				dispatch({ type: SUBMITTING_FORM_ERROR });
			});
	}

	function handleChange(e) {
		setCCData({
			...ccData,
			[e.target.name]: e.target.value,
		});
	}

	return (
		<>
			{globalState.error && <ErrorSubmission lang={lang} translate={translate} />}
			{globalState.loadingFormSubmit && <LoadingSubmission />}
			{globalState.submitFormSuccess && <SuccessSubmission lang={lang} translate={translate} />}
			{!globalState.loadingFormSubmit && !globalState.submitFormSuccess && !globalState.error && (
				<UserCreditCardController
					ccData={ccData}
					handleChange={handleChange}
					handleSubmit={handleSubmit}
					lang={lang}
					translate={translate}
				/>
			)}
		</>
	);
};

export default MainApplicationController;
