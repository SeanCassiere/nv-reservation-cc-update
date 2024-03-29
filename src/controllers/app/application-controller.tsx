import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { authenticateWithLambda } from "@/api/lambdas";
import { bootUp } from "@/api/system/bootUp";
import { initDataFetch } from "@/api/system/initDataFetch";
import { AppNavContextProvider } from "@/hooks/logic/useAppNavContext";
import { useAuthStore } from "@/hooks/stores/useAuthStore";
import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import ErrorSubmission from "@/pages/error-submission";
import LoadingSubmission from "@/pages/loading-submission";
import { APP_CONSTANTS, APP_DEFAULTS } from "@/utils/constants";

import DisplayCurrentController from "./display-active";

const bootStatuses = ["authenticating", "loaded", "authentication_error", "core_details_fetch_failed"] as const;
type BootStatus = (typeof bootStatuses)[number];

const ApplicationController: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const setAuthValues = useAuthStore((s) => s.setAuthValues);

  const setRawQueryToStore = useConfigStore((s) => s.setRawQuery);
  const setConfigStoreValuesToStore = useConfigStore((s) => s.setConfigValues);

  const setInitReferenceValuesToStore = useRuntimeStore((s) => s.setReferenceInitValues);
  const setEmailTemplateAndClientIdToStore = useRuntimeStore((s) => s.setEmailTemplateAndClientId);
  const setRuntimeConfirmationEmailToStore = useRuntimeStore((s) => s.setRuntimeConfirmationEmail);
  const setRuntimeRentalToStore = useRuntimeStore((s) => s.setRuntimeRental);
  const setRuntimeAdminUserIdToStore = useRuntimeStore((s) => s.setRuntimeAdminUserId);
  const setRuntimeReferenceIdToStore = useRuntimeStore((s) => s.setRuntimeReferenceId);

  const fullFlow = useConfigStore((s) => s.fullFlow);
  const referenceType = useRuntimeStore((s) => s.referenceType);

  const [appBootStatus, setAppBootStatus] = useState<BootStatus>("authenticating");

  const { mutate: callInitDataFetch } = useMutation({
    mutationKey: ["app-init-details"],
    mutationFn: initDataFetch,
    onSuccess: (data) => {
      setRuntimeReferenceIdToStore(data.referenceId);
      setRuntimeConfirmationEmailToStore(data.confirmationEmail);
      setRuntimeRentalToStore(data.rental);
      setRuntimeAdminUserIdToStore(data.adminUserId);
      setAppBootStatus("loaded");
    },
    onError: () => {
      setAppBootStatus("core_details_fetch_failed");
    },
  });

  const { mutate: authorizeApp } = useMutation({
    mutationKey: ["app-authorization"],
    mutationFn: authenticateWithLambda,
    onSuccess: (data) => {
      setAuthValues(data);
      callInitDataFetch({
        clientId: `${data.clientId}`,
        referenceType: `${data.referenceType}`,
        referenceIdentifier: `${data.referenceIdentifier}`,
        responseTemplateId: `${data.responseTemplateId}`,
        stopEmailGlobalDocuments: data.disableGlobalDocumentsForConfirmationEmail,
        adminUserId: data.userId,
      });
    },
    onError: () => {
      setAppBootStatus("authentication_error");
    },
  });

  const {
    data: bootData,
    status: bootStatus,
    error: bootError,
  } = useQuery({
    queryKey: ["boot-sequence"],
    queryFn: () => bootUp({ windowQueryString: window.location.search }),
    enabled: true,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: false,
  });

  useEffect(() => {
    if (bootStatus === "success") {
      const data = bootData;
      if (!data) {
        navigate("/not-available");
        return;
      }

      setRawQueryToStore({ rawConfig: data.rawConfig, rawQueryString: window.location.search });
      setConfigStoreValuesToStore({
        environment: data.environment,
        flow: data.flow,
        predefinedAdminUserId: data.userId,
        successSubmissionScreen: data.successSubmissionScreen,
        showPreSubmitSummary:
          typeof data.showPreSubmitSummary === "boolean"
            ? data.showPreSubmitSummary
            : APP_DEFAULTS.SHOW_PRE_SUBMIT_SUMMARY,
        disableGlobalDocumentsForConfirmationEmail: data.stopEmailGlobalDocuments,
        disableEmailAttachingDriverLicense: data.stopAttachingDriverLicenseFiles,
        colorScheme: data.colorScheme,
      });
      setEmailTemplateAndClientIdToStore({ newClientId: data.clientId, newTemplateId: data.responseEmailTemplateId });
      setInitReferenceValuesToStore({ newReferenceType: data.referenceType, newReferenceIdentifier: data.referenceId });

      // calls the authorization lambda
      authorizeApp({ clientId: data.clientId, environment: data.environment });
    }
  }, [
    authorizeApp,
    bootData,
    bootStatus,
    navigate,
    setConfigStoreValuesToStore,
    setEmailTemplateAndClientIdToStore,
    setInitReferenceValuesToStore,
    setRawQueryToStore,
  ]);

  if (bootStatus === "error") {
    throw bootError;
  }

  return (
    <>
      {appBootStatus === "authenticating" && <LoadingSubmission title={t("authenticationSubmission.title")} />}
      {appBootStatus === "authentication_error" && (
        <ErrorSubmission msg={t("authenticationSubmission.message")} tryAgainButton />
      )}
      {appBootStatus === "core_details_fetch_failed" && (
        <ErrorSubmission
          title={
            t("coreDetailsFetchError.title", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            }) as string
          }
          msg={t("coreDetailsFetchError.message", {
            context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
          })}
          tryAgainButton
          tryAgainButtonText={
            t("coreDetailsFetchError.btnRetrySearch", {
              context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            }) as string
          }
        />
      )}
      {appBootStatus === "loaded" && (
        <AppNavContextProvider configFlow={fullFlow}>
          <DisplayCurrentController />
        </AppNavContextProvider>
      )}
    </>
  );
};

export default ApplicationController;
