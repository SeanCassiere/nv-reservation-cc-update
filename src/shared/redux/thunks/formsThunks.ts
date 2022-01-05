import { createAsyncThunk } from "@reduxjs/toolkit";

import client from "../../api/client";
import clientV3 from "../../api/clientV3";
import { urlBlobToBase64 } from "../../utils/blobUtils";

import { bodyInsertV3Card } from "../../utils/bodyInsertCard";
import { bodySendEmail } from "../../utils/bodySendEmail";
import { v3UploadLicenseImage } from "../../utils/bodyUploadLicenseImage";
import { setSubmissionState, setSubmissionErrorState, setSubmissionMessage } from "../slices/forms";
import { RootState } from "../store";

export const submitFormThunk = createAsyncThunk("forms/submitAllAvailable", async (_, { getState, dispatch }) => {
	dispatch(setSubmissionState("submitting_details_pending"));

	const state = getState() as RootState;
	const configState = state.config;
	const t = state.config.translations;
	const formState = state.forms;
	const reservationState = state.retrievedDetails;

	// Post card details
	try {
		if (formState.creditCardForm.isReadyToSubmit) {
			dispatch(setSubmissionMessage(t.form.submitting_msgs.credit_card));
			await clientV3.post(
				`/Customers/${reservationState.customerId}/CreditCards`,
				bodyInsertV3Card(formState.creditCardForm.data)
			);
		}
	} catch (error) {
		console.info(error);
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	// Upload driver's license images
	try {
		if (formState.licenseUploadForm.isReadyToSubmit) {
			dispatch(setSubmissionMessage(t.form.submitting_msgs.license_images_bundle));
			const frontLicenseBase64 = await urlBlobToBase64(formState.licenseUploadForm.data.frontImageUrl!);
			const backLicenseBase64 = await urlBlobToBase64(formState.licenseUploadForm.data.backImageUrl!);

			const frontImagePayload = v3UploadLicenseImage({
				config: configState,
				side: "Front",
				imageName: formState.licenseUploadForm.data.frontImageName!,
				imageBase64: frontLicenseBase64,
			});
			const backImagePayload = v3UploadLicenseImage({
				config: configState,
				side: "Back",
				imageName: formState.licenseUploadForm.data.backImageName!,
				imageBase64: backLicenseBase64,
			});

			const submitFrontImagePromise = clientV3.post(
				`/Customers/${reservationState.customerId}/Documents`,
				frontImagePayload
			);
			const submitBackImagePromise = clientV3.post(
				`/Customers/${reservationState.customerId}/Documents`,
				backImagePayload
			);

			await Promise.all([submitFrontImagePromise, submitBackImagePromise]);
		}
	} catch (error) {
		console.info(error);
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	// Post confirmation email using responseTemplateID
	try {
		dispatch(setSubmissionMessage(t.form.submitting_msgs.confirmation_email));
		await client.post("/Email/SendEmail", bodySendEmail({ reservationDetails: reservationState, config: configState }));
	} catch (error) {
		console.info(error);
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	dispatch(setSubmissionState("submitting_details_success"));
	return true;
});
