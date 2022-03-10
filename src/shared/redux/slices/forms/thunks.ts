import { createAsyncThunk } from "@reduxjs/toolkit";

import clientV3 from "../../../api/clientV3";
import { urlBlobToBase64 } from "../../../utils/blobUtils";
import { bodyEmailTemplate } from "../../../utils/bodyEmailTemplate";

import { bodyInsertV3Card } from "../../../utils/bodyInsertCard";
import { v3UploadLicenseImage } from "../../../utils/bodyUploadLicenseImage";
import { setSubmissionState, setSubmissionErrorState, setSubmissionMessage } from "./slice";
import { RootState } from "../../store";

export const submitFormThunk = createAsyncThunk("forms/submitAllAvailable", async (_, { getState, dispatch }) => {
	dispatch(setSubmissionState("submitting_details_pending"));

	const state = getState() as RootState;
	const configState = state.config;
	const t = state.config.translations;
	const formState = state.forms;
	const reservationState = state.retrievedDetails;

	console.groupCollapsed("forms/submitAllAvailable");

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
		console.error("post credit card details error", error);
		console.groupEnd();
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
		console.error("license images upload error", error);
		console.groupEnd();
		dispatch(setSubmissionErrorState("submitting_details_error"));
		return;
	}

	// Post confirmation email using responseTemplateID
	if (reservationState.responseTemplateBlobUrl !== "") {
		try {
			dispatch(setSubmissionMessage(t.form.submitting_msgs.confirmation_email));
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
