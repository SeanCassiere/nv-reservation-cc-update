import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";

import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";

import { useFormStore } from "../../hooks/stores/useFormStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { useConfigStore } from "../../hooks/stores/useConfigStore";
import { postConfirmationEmail } from "../../api/emailsApi";
import { postCompletionLambda } from "../../api/lambdas";
import { postFormDataToApi } from "../../api/boot";

const PostFormDataControllerDefault: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isQa = useConfigStore((s) => s.qa);
  const adminUserId = useRuntimeStore((s) => s.adminUserId);
  const clientId = useRuntimeStore((s) => s.clientId);
  const responseTemplateId = useRuntimeStore((s) => s.responseTemplateId);
  const referenceType = useRuntimeStore((s) => s.referenceType);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const confirmationEmail = useRuntimeStore((s) => s.confirmationEmail);
  const rentalData = useRuntimeStore((s) => s.rental);
  const customerId = useRuntimeStore((s) => s.rental?.customerId);
  const setSubmissionCompleteState = useRuntimeStore((s) => s.setSubmissionCompleteState);

  const creditCardState = useFormStore((s) => s.customerCreditCard);
  const driverLicenseState = useFormStore((s) => s.driversLicense);
  const rentalSignatureState = useFormStore((s) => s.rentalSignature);

  const [currentMessage, setCurrentMessage] = useState(t("appStatusMessages.submittingYourDetailsMsg"));

  const getOpsForCompleteStatus = (statEnum: "success" | "failed") => ({
    qa: isQa,
    clientId: clientId ?? 0,
    status: statEnum,
    customerId: rentalData?.customerId ?? 0,
    referenceType,
    referenceId: referenceId ?? 0,
  });

  const { mutate: markCompletionStatus } = useMutation(["submission", "completed"], postCompletionLambda, {
    onSuccess: () => {
      navigate("/success", { replace: true, state: { from: location } });
      setSubmissionCompleteState(true);
    },
    onError: () => navigate("/error", { replace: true, state: { from: location } }),
  });

  const { mutate: sendConfirmationEmail } = useMutation(["submission", "confirmation-email"], postConfirmationEmail, {
    onSuccess: () => {
      markCompletionStatus(getOpsForCompleteStatus("success"));
    },
    onError: () => markCompletionStatus(getOpsForCompleteStatus("failed")),
  });

  useQuery(
    ["submission", "form-data"],
    () =>
      postFormDataToApi({
        clientId: clientId ?? 0,
        creditCard: creditCardState,
        driversLicense: driverLicenseState,
        rentalSignature: rentalSignatureState,
        customerId: customerId ?? 0,
        referenceId: referenceId ?? 0,
        referenceType,
        rental: rentalData,
      }),
    {
      onSuccess: () => {
        if (responseTemplateId && confirmationEmail && confirmationEmail?.dataUrl) {
          const dataUrl = confirmationEmail.dataUrl;
          setCurrentMessage(t("appStatusMessages.sendingConfirmationEmail"));
          sendConfirmationEmail({
            dataUrl,
            clientId: Number(clientId),
            userId: adminUserId,
            referenceId: Number(referenceId),
            referenceType,
            subject: confirmationEmail.subject,
            toEmails: confirmationEmail.toList,
            ccEmails: confirmationEmail.ccList,
            templateId: confirmationEmail.templateId,
            templateTypeId: confirmationEmail.templateTypeId,
            fromEmail: confirmationEmail.fromEmail,
          });
          return;
        }
        markCompletionStatus(getOpsForCompleteStatus("success"));
      },
      onError: () => markCompletionStatus(getOpsForCompleteStatus("failed")),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    }
  );

  return <LoadingSubmission title={currentMessage} />;
};

export default PostFormDataControllerDefault;
