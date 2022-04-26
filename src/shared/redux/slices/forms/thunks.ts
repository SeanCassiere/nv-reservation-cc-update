import { createAsyncThunk } from "@reduxjs/toolkit";
import i18next from "i18next";

import clientV3 from "../../../api/clientV3";
import { insertCreditCardForCustomer, uploadDriverLicenseImageForCustomer } from "../../../api/customerApi";

import { bodyEmailTemplate } from "../../../utils/bodyEmailTemplate";

import { setSubmissionState, setSubmissionErrorState, setSubmissionMessage } from "./slice";
import { RootState } from "../../store";
import { uploadRentalDigitalSignatureFromUrl } from "../../../api/digitalSignatureApi";

export const submitFormThunk = createAsyncThunk("forms/submitAllAvailable", async (_, { getState, dispatch }) => {
	dispatch(setSubmissionState("submitting_details_pending"));
	const { t } = i18next;

	const state = getState() as RootState;

	const configState = state.config;
	const formState = state.forms;
	const reservationState = state.retrievedDetails;

	console.group("forms/submitAllAvailable");

	const formPromisesToRun = [];

	// Add Credit Card details to array of submissions to run
	if (formState.creditCardForm.isReadyToSubmit) {
		formPromisesToRun.push(
			insertCreditCardForCustomer(`${reservationState.data.customerId}`, formState.creditCardForm.data)
		);
	}

	// Add driver's license images to array of submissions to run
	if (formState.licenseUploadForm.isReadyToSubmit) {
		formPromisesToRun.push(
			uploadDriverLicenseImageForCustomer(
				`${reservationState.data.customerId}`,
				`${configState.clientId}`,
				formState.licenseUploadForm.data.frontImageUrl!,
				formState.licenseUploadForm.data.frontImageName ?? ""
			)
		);
		formPromisesToRun.push(
			uploadDriverLicenseImageForCustomer(
				`${reservationState.data.customerId}`,
				`${configState.clientId}`,
				formState.licenseUploadForm.data.backImageUrl!,
				formState.licenseUploadForm.data.backImageName ?? ""
			)
		);
	}

	// Add the rental signature to the array of submissions to run
	if (formState.rentalSignatureForm.isReadyToSubmit) {
		formPromisesToRun.push(
			uploadRentalDigitalSignatureFromUrl(
				formState.rentalSignatureForm.data.signatureUrl,
				reservationState.data.driverId,
				reservationState.data.customerName,
				configState.referenceType,
				reservationState.referenceId
			)
		);
	}

	// await saving all the form details
	dispatch(setSubmissionMessage(t("app_status_messages.submitting_your_details_msg")));
	const runPromises = await Promise.all(formPromisesToRun);
	if (runPromises.includes(false)) {
		console.groupEnd();
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	// Post confirmation email using responseTemplateID
	if (reservationState.responseTemplateBlobUrl !== "") {
		try {
			dispatch(setSubmissionMessage(t("app_status_messages.sending_confirmation_email")));
			const html = await fetch(reservationState.responseTemplateBlobUrl).then((res) => res.text());

			await clientV3.post(
				"/Emails",
				bodyEmailTemplate({ reservationDetails: reservationState, config: configState, emailBody: html })
			);
			URL.revokeObjectURL(reservationState.responseTemplateBlobUrl);
		} catch (error) {
			console.error("confirmation email sending error", error);
			console.groupEnd();
			dispatch(setSubmissionErrorState("submitting_details_error"));
			return;
		}
	}

	console.log("completed form submission operation");
	console.groupEnd();

	dispatch(setSubmissionState("submitting_details_success"));
	return true;
});
