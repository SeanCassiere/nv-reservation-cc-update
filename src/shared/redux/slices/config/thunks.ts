import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import clientV3, { AUTH_URL } from "../../../api/clientV3";
import { bodyEmailTemplate } from "../../../utils/bodyEmailTemplate";

import { setAppStatus } from "./slice";
import { setAccessToken } from "../auth/slice";
import {
  setCcEmails,
  setEmailTemplateDetails,
  setPreviewHtmlBlobUrl,
  setRetrievedRentalDetails,
  setSystemUserId,
  setGetComposeEmailDetails,
} from "../retrievedDetails/slice";
import { RootState } from "../../store";
import { getReservationByIdOrNumber } from "../../../api/reservationApi";
import { getAgreementByIdOrNumber } from "../../../api/agreementApi";
import { APP_CONSTANTS } from "../../../utils/constants";
import { getComposeEmailDetails } from "../../../api/emailsApi";

interface User {
  userID: number;
  isReservationEmail: boolean;
  email: string;
  isActive: boolean;
  userRoleID: number;
}

// const auth = await client.post("/Login/GetClientSecretToken", {
// 	ClientId: clientId,
// 	ConsumerType: "Admin,Basic",
// });
// dispatch(setAccessToken({ token: auth.data.apiToken.access_token }));

export const initializeAppThunk = createAsyncThunk(
  "config/initializeApp",
  async (_, { dispatch, getState, rejectWithValue }) => {
    let systemUserId = 0;

    let state = getState() as RootState;
    const { clientId, responseTemplateId } = state.config;
    console.group("config/initializeApp");

    // authenticate app
    try {
      let auth_url = AUTH_URL;
      if (state.config.qa) {
        auth_url += "?qa=true";
      }
      const authV3 = await axios.get(auth_url);

      if (authV3.status !== 200 || !authV3.data.access_token || !authV3.data.token_type) {
        throw new Error("Authentication failed");
      }

      dispatch(setAccessToken({ access_token: authV3.data.access_token, token_type: authV3.data.token_type }));
    } catch (error) {
      console.error("get authentication tokens", error);
      console.groupEnd();
      return dispatch(setAppStatus({ status: "authentication_error" }));
    }

    // get cc emails
    try {
      const res = await clientV3.get(`/Users`, {
        params: {
          clientId: clientId,
        },
      });

      const adminUserIdToUse = res.data.filter((u: User) => u.userRoleID === 1);

      if (adminUserIdToUse.length > 0) {
        dispatch(setSystemUserId(adminUserIdToUse[0].userID));
        systemUserId = adminUserIdToUse[0].userID;
      }

      const reservationEmailUsers: User[] = res.data
        .filter((u: User) => u.isReservationEmail)
        .filter((u: User) => u.email && u.email.trim() !== "")
        .filter((u: User) => u.isActive);
      const emailsToCC = reservationEmailUsers.map((u: User) => u.email);

      dispatch(setCcEmails(emailsToCC));
    } catch (error) {
      console.error("get cc emails", error);
      // console.groupEnd();
      // return dispatch(setAppStatus({ status: "authentication_error" }));
    }

    // Fetch the customer details based on the Reference Type = Reservation | Agreement
    if (state.config.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION) {
      const reservationResponse = await getReservationByIdOrNumber(
        clientId,
        state.retrievedDetails.referenceNo,
        state.retrievedDetails.referenceId
      );

      if (!reservationResponse) {
        console.error("NOT ABLE TO FIND RESERVATION");
        console.groupEnd();
        return dispatch(setAppStatus({ status: "core_details_fetch_failed" }));
      }

      dispatch(setRetrievedRentalDetails(reservationResponse));
    } else if (state.config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT) {
      const agreementResponse = await getAgreementByIdOrNumber(
        clientId,
        state.retrievedDetails.referenceNo,
        state.retrievedDetails.referenceId,
        systemUserId
      );

      if (!agreementResponse) {
        console.error("NOT ABLE TO FIND AGREEMENT");
        console.groupEnd();
        return dispatch(setAppStatus({ status: "core_details_fetch_failed" }));
      }

      dispatch(setRetrievedRentalDetails(agreementResponse));
    }

    // get email template
    try {
      const res = await clientV3.get(`/Emails/${responseTemplateId}/EmailTemplate`, {
        params: { clientId: clientId },
      });
      const { templateTypeId, subjectLine } = res.data;

      dispatch(setEmailTemplateDetails({ templateTypeId, subjectLine }));
    } catch (error) {
      console.error("get email template details", error);
      // console.groupEnd();
      // failing to fetch the email template details should not fail the app
      // return dispatch(setAppStatus({ status: "authentication_error" }));
    }

    // get compose email details
    state = getState() as RootState;
    const composeDetails = await getComposeEmailDetails(
      clientId,
      systemUserId,
      state.config.referenceType,
      state.retrievedDetails.referenceId,
      state.config.responseTemplateId!
    );
    if (composeDetails) {
      dispatch(setGetComposeEmailDetails(composeDetails));
    }

    // get email preview html and turn into a blob url
    try {
      const { retrievedDetails, config: configDetails } = getState() as RootState;
      if (retrievedDetails.responseTemplateTypeId !== 0) {
        const res = await clientV3.post(
          "/Emails/PreviewTemplate",
          bodyEmailTemplate({ reservationDetails: retrievedDetails, config: configDetails })
        );

        const blob = new Blob([res.data], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        dispatch(setPreviewHtmlBlobUrl(url));
      }
    } catch (error) {
      console.error("get email template html", error);
      // console.groupEnd();
      // failing to fetch the email template html should not fail the app
      // return dispatch(setAppStatus({ status: "authentication_error" }));
    }

    console.groupEnd();
    return dispatch(setAppStatus({ status: "loaded" }));
  }
);
