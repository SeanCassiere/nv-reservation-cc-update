import React, { useState, useReducer } from "react";

import translate from "../utils/translations.json";

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

const MainApplicationController = ({ clientId, reservationId, lang }) => {
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

	return (
		<>
			{globalState.error && <ErrorSubmission lang={lang} />}
			{globalState.loadingFormSubmit && <LoadingSubmission title={translate[lang].form.submitting_msg} />}
			{globalState.submitFormSuccess && <SuccessSubmission lang={lang} />}
			{!globalState.loadingFormSubmit && !globalState.submitFormSuccess && !globalState.error && (
				<UserCreditCardController ccData={ccData} setCCData={setCCData} handleSubmit={handleSubmit} lang={lang} />
			)}
		</>
	);
};

export default MainApplicationController;
