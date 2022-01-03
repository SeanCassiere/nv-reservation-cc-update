import { createAsyncThunk } from "@reduxjs/toolkit";

import client, { clientV3 } from "../../api/client";
import { urlBlobToBase64 } from "../../utils/blobUtils";

import { bodyInsertCard } from "../../utils/bodyInsertCard";
import { v3UploadLicenseImage } from "../../utils/bodyUploadLicenseImage";
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

			const frontPayload = v3UploadLicenseImage({
				config: configState,
				side: "Front",
				imageName: formState.licenseUploadForm!.data!.frontImageName!,
				imageBase64: frontLicenseBase64,
			});
			const postFront = clientV3.post(`/Customer/${reservationState.customerId}/Documents`, frontPayload);

			const backPayload = v3UploadLicenseImage({
				config: configState,
				side: "Back",
				imageName: formState.licenseUploadForm!.data!.backImageName!,
				imageBase64: backLicenseBase64,
			});
			const postBack = clientV3.post(`/Customer/${reservationState.customerId}/Documents`, backPayload);

			await Promise.all([postFront, postBack]);
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
