import React, { useState, useReducer } from "react";

import { updateCreditCardByCustomerId } from "../api/apiFunctions";

import CreditCardForm from "../components/CreditCardForm";
import ErrorSubmission from "./ErrorSubmission";
import SuccessSubmission from "./SuccessSubmission";
import LoadingSubmission from "./LoadingSubmission";

const initialCreditCardInfo = {
	ccType: "",
	name: "",
	number: "",
	monthExpiry: "",
	yearExpiry: "",
	cvc: "",
	billingZip: "",
};

const reducer = (state, action) => {
	switch (action.type) {
		case "SUBMITTING_FORM_LOADING":
			return { ...state, loadingFormSubmit: true };
		case "SUBMITTING_FORM_ERROR":
			return { ...state, error: true, loadingFormSubmit: false };
		case "SUBMITTING_FORM_SUCCESS":
			return { error: false, loadingFormSubmit: false, submitFormSuccess: true };
		default:
			return state;
	}
};

const initialState = {
	error: false,
	loadingFormSubmit: false,
	submitFormSuccess: false,
};

const UserApplicationForm = ({ clientId, reservationId, lang, translate }) => {
	const [globalState, dispatch] = useReducer(reducer, initialState);
	const [ccData, setCCData] = useState(initialCreditCardInfo);

	function handleSubmit(e) {
		e.preventDefault();
		if (ccData.number.length < 16) return;
		dispatch({ type: "SUBMITTING_FORM_LOADING" });
		updateCreditCardByCustomerId(clientId, reservationId, ccData)
			.then(() => dispatch({ type: "SUBMITTING_FORM_SUCCESS" }))
			.catch((err) => {
				console.log(err);
				dispatch({ type: "SUBMITTING_FORM_ERROR" });
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
				<CreditCardForm
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

export default UserApplicationForm;
