import React, { useState, useReducer, useEffect } from "react";

import translate from "../utils/translations.json";

import {
	getReservationDetailsByReservationId,
	insertCreditCardDetailsByCustomerId,
	sendConfirmationEmail,
} from "../api/apiFunctions";
import { reducer, initialState } from "../utils/reducerLogic";
import {
	SUBMITTING_FORM_LOADING,
	SUBMITTING_FORM_SUCCESS,
	SUBMITTING_FORM_ERROR,
	AUTH_RESERVATION_LOADING,
	AUTH_RESERVATION_SUCCESS,
	AUTH_RESERVATION_ERROR,
} from "../utils/reducerConstants";

import UserCreditCardController from "./UserCreditCardController";
import ErrorSubmission from "../layouts/ErrorSubmission";
import SuccessSubmission from "../layouts/SuccessSubmission";
import LoadingSubmission from "../layouts/LoadingSubmission";

const initialCreditCardInfo = {
	name: "",
	ccType: "",
	number: "",
	monthExpiry: "",
	yearExpiry: "",
	cvc: "",
	billingZip: "",
};

const MainApplicationController = ({ clientId, reservationId, lang, emailTemplateId }) => {
	const [globalState, dispatch] = useReducer(reducer, initialState);
	const [ccData, setCCData] = useState(initialCreditCardInfo);

	const {
		loadingReservationAuthentication,
		errorSubmitting,
		submitFormSuccess,
		loadingFormSubmit,
		errorAuthenticating,
	} = globalState;
	const { token, reservationInfo } = globalState;

	useEffect(() => {
		dispatch({ type: AUTH_RESERVATION_LOADING });
		getReservationDetailsByReservationId(clientId, reservationId)
			.then((res) => {
				dispatch({ type: AUTH_RESERVATION_SUCCESS, payload: res });
			})
			.catch((err) => {
				console.log(err);
				dispatch({ type: AUTH_RESERVATION_ERROR });
			});
	}, [dispatch, clientId, reservationId]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		dispatch({ type: SUBMITTING_FORM_LOADING });
		try {
			await insertCreditCardDetailsByCustomerId(token, reservationInfo.customerId, ccData);

			await sendConfirmationEmail(token, reservationId, clientId, emailTemplateId);

			dispatch({ type: SUBMITTING_FORM_SUCCESS });
		} catch (err) {
			console.log(err);
			dispatch({ type: SUBMITTING_FORM_ERROR });
		}
	};

	return (
		<>
			{loadingReservationAuthentication && (
				<LoadingSubmission title={translate[lang].authentication_submission.title} />
			)}
			{errorAuthenticating && <ErrorSubmission lang={lang} msg={translate[lang].authentication_submission.message} />}
			{errorSubmitting && <ErrorSubmission lang={lang} msg={translate[lang].bad_submission.message} />}
			{loadingFormSubmit && <LoadingSubmission title={translate[lang].form.submitting_msg} />}
			{submitFormSuccess && <SuccessSubmission lang={lang} />}
			{!loadingFormSubmit &&
				!submitFormSuccess &&
				!errorSubmitting &&
				!loadingReservationAuthentication &&
				!errorAuthenticating && (
					<UserCreditCardController ccData={ccData} setCCData={setCCData} handleSubmit={handleSubmit} lang={lang} />
				)}
		</>
	);
};

export default MainApplicationController;
