import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";

import ErrorSubmission from "../../pages/ErrorSubmission/ErrorSubmission";
import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";
import DisplayCurrentController from "./DisplayCurrentController";

import { useConfigStore } from "../../hooks/stores/useConfigStore";
import { useAuthStore } from "../../hooks/stores/useAuthStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";

import { APP_CONSTANTS } from "../../utils/constants";
import { authenticateWithLambda } from "../../api/lambdas";
import { bootUp, initDataFetch } from "../../api/boot";

const bootStatuses = ["authenticating", "loaded", "authentication_error", "core_details_fetch_failed"] as const;
type BootStatus = typeof bootStatuses[number];

const ApplicationController: React.FC = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const setAuthValues = useAuthStore((s) => s.setAuthValues);

  const setRawQuery = useConfigStore((s) => s.setRawQuery);
  const setConfigStoreValues = useConfigStore((s) => s.setConfigValues);
  const setInitReferenceValues = useRuntimeStore((s) => s.setReferenceInitValues);
  const setEmailTemplateAndClientId = useRuntimeStore((s) => s.setEmailTemplateAndClientId);
  const setRuntimeConfirmationEmail = useRuntimeStore((s) => s.setRuntimeConfirmationEmail);
  const setRuntimeRental = useRuntimeStore((s) => s.setRuntimeRental);
  const setRuntimeAdminUserId = useRuntimeStore((s) => s.setRuntimeAdminUserId);
  const setRuntimeReferenceId = useRuntimeStore((s) => s.setRuntimeReferenceId);

  const flowScreens = useConfigStore((s) => s.flow);
  const referenceType = useRuntimeStore((s) => s.referenceType);

  const [bootStatus, setBootStatus] = useState<BootStatus>("authenticating");

  const { mutate: callInitDataFetch } = useMutation(["app-init-details"], initDataFetch, {
    onSuccess: (data) => {
      setRuntimeReferenceId(data.referenceId);
      setRuntimeConfirmationEmail(data.confirmationEmail);
      setRuntimeRental(data.rental);
      setRuntimeAdminUserId(data.adminUserId);
      setBootStatus("loaded");
    },
    onError: (err) => {
      setBootStatus("core_details_fetch_failed");
    },
  });

  const { mutate: authorizeApp } = useMutation(["app-authorization"], authenticateWithLambda, {
    onSuccess: (data) => {
      setAuthValues(data);
      callInitDataFetch({
        clientId: `${data.clientId}`,
        referenceType: `${data.referenceType}`,
        referenceIdentifier: `${data.referenceIdentifier}`,
        responseTemplateId: `${data.responseTemplateId}`,
      });
    },
    onError: (err) => {
      setBootStatus("authentication_error");
    },
  });

  const { error, isError, isLoading } = useQuery(
    ["boot-sequence"],
    async () => bootUp({ windowQueryString: window.location.search }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: false,
      onSuccess: (data) => {
        if (!data) {
          navigate("/not-available");
          return;
        }
        setRawQuery({ rawConfig: data.rawConfig, rawQueryString: window.location.search });
        setConfigStoreValues({
          flow: data.flow,
          fromRentall: data.fromRentall,
          qa: data.qa,
          successSubmissionScreen: data.successSubmissionScreen,
        });
        setEmailTemplateAndClientId({ newClientId: data.clientId, newTemplateId: data.responseEmailTemplateId });
        setInitReferenceValues({ newReferenceType: data.referenceType, newReferenceIdentifier: data.referenceId });
        authorizeApp({ clientId: data.clientId, qa: data.qa });
      },
      onError: (err) => {
        function explode() {
          throw new Error(err as any);
        }
        explode();
      },
    }
  );

  /*
   * Application Controller management
   */
  const [previousControllers, setPreviousControllers] = useState<string[]>([]);
  const [activeController, setActiveController] = useState<string | null>(null);
  const [remainingFlowControllers, setRemainingFlowControllers] = useState<string[]>([]);

  const isPrevPageAvailable = useMemo(() => previousControllers.length > 0, [previousControllers]);
  const handlePrevious = useCallback(() => {
    if (previousControllers.length <= 0) return;

    const currentPrevScreens = previousControllers;
    const currentScreen = activeController!;

    const newActiveScreen = currentPrevScreens.pop() || flowScreens[0];

    setActiveController(newActiveScreen);
    setPreviousControllers(currentPrevScreens.filter((screen) => screen !== newActiveScreen));
    setRemainingFlowControllers([currentScreen, ...remainingFlowControllers]);
  }, [activeController, flowScreens, previousControllers, remainingFlowControllers]);

  const isNextPageAvailable = useMemo(() => remainingFlowControllers.length > 0, [remainingFlowControllers]);
  const handleSubmit = useCallback(() => {
    if (remainingFlowControllers.length <= 0) {
      // navigate to a protected page with a submission controller
      return navigate("/submit-details", { replace: true });
    } else {
      const currentScreen = activeController!;
      const nextScreen = remainingFlowControllers[0];

      const newPreviousControllersList = [...previousControllers, currentScreen]; //correct

      const newFutureControllersList = remainingFlowControllers.filter((e) => e !== nextScreen);

      setPreviousControllers(newPreviousControllersList);
      setRemainingFlowControllers(newFutureControllersList);
      setActiveController(nextScreen);
    }
  }, [activeController, remainingFlowControllers, previousControllers, navigate]);

  useEffect(() => {
    const startingController = flowScreens[0];
    // Removing the starting controller since it will automatically be shown
    const startingControllers = flowScreens.filter((elem) => elem !== startingController);

    setRemainingFlowControllers(startingControllers);
    setActiveController(startingController);
  }, [flowScreens]);

  return (
    <>
      {isLoading === false && isError && error}
      {bootStatus === "authenticating" && <LoadingSubmission title={t("authenticationSubmission.title")} />}
      {bootStatus === "authentication_error" && (
        <ErrorSubmission msg={t("authenticationSubmission.message")} tryAgainButton />
      )}
      {bootStatus === "core_details_fetch_failed" && (
        <ErrorSubmission
          title={t("coreDetailsFetchError.title", {
            context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
          })}
          msg={t("coreDetailsFetchError.message", {
            context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
          })}
          tryAgainButton
        />
      )}
      {bootStatus === "loaded" && (
        <>
          <DisplayCurrentController
            selectedController={activeController}
            handleNext={handleSubmit}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
            isNextPageAvailable={isNextPageAvailable}
          />
        </>
      )}
    </>
  );
};

export default ApplicationController;
