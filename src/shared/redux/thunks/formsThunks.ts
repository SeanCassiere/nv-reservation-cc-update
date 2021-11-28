import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../api/client";
import { urlBlobToBase64 } from "../../utils/blobUtils";

import { bodyInsertCard } from "../../utils/bodyInsertCard";
import { bodySendEmail } from "../../utils/bodySendEmail";
import { setSubmissionState, setSubmissionErrorState } from "../slices/forms";
import { RootState } from "../store";

export const submitFormThunk = createAsyncThunk("forms/submitAlAvailable", async (_, { getState, dispatch }) => {
	dispatch(setSubmissionState("submitting_details_pending"));

	const state = getState() as RootState;
	const configState = state.config;
	const formState = state.forms;
	const reservationState = state.retrievedDetails;

	// Post card details
	try {
		if (formState.creditCardForm.isReadyToSubmit) {
			await client.post(
				"/Customer/InsertCreditCard",
				bodyInsertCard({ creditCardDetails: formState.creditCardForm.data, reservationDetails: reservationState }),
				{
					headers: {
						Authorization: `Bearer ${configState.token}`,
					},
				}
			);
		}
	} catch (error) {
		console.info(error);
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	// Upload driver's license images
	// TODO: API Implementation
	try {
		if (formState.licenseUploadForm.isReadyToSubmit) {
			const frontLicenseBase64 = await urlBlobToBase64(formState.licenseUploadForm.data.frontImageUrl!);
			const backLicenseBase64 = await urlBlobToBase64(formState.licenseUploadForm.data.backImageUrl!);
			console.log("license upload submission api request yet to be implemented");
			console.log("\nreduxThunk: Front License Base64\n", frontLicenseBase64);
			console.log("\nreduxThunk: Back License Base64\n", backLicenseBase64);
		}
	} catch (error) {
		console.info(error);
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	// Post confirmation email using responseTemplateID
	try {
		await client.post(
			"/Email/SendEmail",
			bodySendEmail({ reservationDetails: reservationState, config: configState }),
			{ headers: { Authorization: `Bearer ${configState.token}` } }
		);
	} catch (error) {
		console.info(error);
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	dispatch(setSubmissionState("submitting_details_success"));
	return true;
});
