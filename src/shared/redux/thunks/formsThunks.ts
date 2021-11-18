import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../api/client";
import { urlBlobToBase64 } from "../../utils/blobUtils";

import { bodyInsertCard } from "../../utils/bodyInsertCard";
import { bodySendEmail } from "../../utils/bodySendEmail";
import { setSubmissionState } from "../slices/forms";
import { RootState } from "../store";

export const submitFormThunk = createAsyncThunk("forms/submitAlAvailable", async (_, { getState, dispatch }) => {
	dispatch(setSubmissionState("submitting_details_pending"));

	const state = getState() as RootState;
	const configState = state.config;
	const formState = state.forms;
	const reservationState = state.reservation;

	try {
		// If credit card details are available, then submit them.
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

		if (formState.licenseUploadForm.isReadyToSubmit) {
			const frontLicenseBase64 = await urlBlobToBase64(formState.licenseUploadForm.data.frontImageUrl!);
			const backLicenseBase64 = await urlBlobToBase64(formState.licenseUploadForm.data.backImageUrl!);
			console.log("license upload submission api request yet to be implemented");
			console.log("\nreduxThunk: Front License Base64\n", frontLicenseBase64);
			console.log("\nreduxThunk: Back License Base64\n", backLicenseBase64);
		}

		// send the confirmation email
		await client.post(
			"/Email/SendEmail",
			bodySendEmail({ reservationDetails: reservationState, config: configState }),
			{ headers: { Authorization: `Bearer ${configState.token}` } }
		);

		// all submitted successfully
		dispatch(setSubmissionState("submitting_details_success"));
		return true;
	} catch (error) {
		dispatch(setSubmissionState("submitting_details_error"));
	}
});
