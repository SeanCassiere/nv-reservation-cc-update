import React, { useState, useReducer } from "react";

import { updateCreditCardByCustomerId } from "../api/apiFunctions";

import CreditCardForm from "../components/CreditCardForm";
import ErrorSubmission from "./ErrorSubmission";
import SuccessSubmission from "./SuccessSubmission";
import LoadingSubmission from "./LoadingSubmission";

const currentYearNum = new Date().getFullYear().toString().substr(-2);

const initialCreditCardInfo = {
	ccType: "",
	name: "",
	number: "",
	monthExpiry: "",
	yearExpiry: parseInt(currentYearNum) + 1,
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

const UserApplicationForm = ({ clientId, reservationId }) => {
	const [globalState, dispatch] = useReducer(reducer, initialState);
	const [ccData, setCCData] = useState(initialCreditCardInfo);

	function handleSubmit(e) {
		e.preventDefault();
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
			{globalState.error && <ErrorSubmission />}
			{globalState.loadingFormSubmit && <LoadingSubmission />}
			{globalState.submitFormSuccess && <SuccessSubmission />}
			{!globalState.loadingFormSubmit && !globalState.submitFormSuccess && !globalState.error && (
				<CreditCardForm ccData={ccData} handleChange={handleChange} handleSubmit={handleSubmit} />
			)}
		</>
	);
};

export default UserApplicationForm;
