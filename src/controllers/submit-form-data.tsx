import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import { postConfirmationEmail } from "@/api/emailsApi";
import { postCompletionLambda } from "@/api/lambdas";
import { postFormDataToApi } from "@/api/system/postFormDataToApi";
import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { useFormStore } from "@/hooks/stores/useFormStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";
import LoadingSubmission from "@/pages/loading-submission";

const PostFormDataControllerDefault: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const environment = useConfigStore((s) => s.environment);
  const isGlobalDocumentsStopped = useConfigStore((s) => s.disableGlobalDocumentsForConfirmationEmail);
  const isDriverLicenseAttachmentsStopped = useConfigStore((s) => s.disableEmailAttachingDriverLicense);
  const adminUserId = useRuntimeStore((s) => s.adminUserId);
  const clientId = useRuntimeStore((s) => s.clientId);
  const responseTemplateId = useRuntimeStore((s) => s.responseTemplateId);
  const referenceType = useRuntimeStore((s) => s.referenceType);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const confirmationEmail = useRuntimeStore((s) => s.confirmationEmail);
  const rentalData = useRuntimeStore((s) => s.rental);
  const customerId = useRuntimeStore((s) => s.rental?.customerId);
  const fetchedGlobalDocuments = useRuntimeStore((s) => s.confirmationEmail?.globalDocuments);
  const setSubmissionCompleteState = useRuntimeStore((s) => s.setSubmissionCompleteState);

  const creditCardState = useFormStore((s) => s.customerCreditCard);
  const driverLicenseState = useFormStore((s) => s.driversLicense);
  const rentalSignatureState = useFormStore((s) => s.rentalSignature);

  const [currentMessage, setCurrentMessage] = useState(t("appStatusMessages.submittingYourDetailsMsg"));

  const getOpsForCompleteStatus = useCallback(
    (statEnum: "success" | "failed") => ({
      environment,
      clientId: clientId ?? 0,
      status: statEnum,
      customerId: rentalData?.customerId ?? 0,
      referenceType,
      referenceId: referenceId ?? 0,
    }),
    [clientId, environment, referenceId, referenceType, rentalData?.customerId],
  );

  const { mutate: markCompletionStatus } = useMutation({
    mutationKey: ["submission", "completed"],
    mutationFn: postCompletionLambda,
    onSuccess: () => {
      navigate("/success", { replace: true, state: { from: location } });
      setSubmissionCompleteState(true);
    },
    onError: () => navigate("/error", { replace: true, state: { from: location } }),
  });

  const { mutate: sendConfirmationEmail } = useMutation({
    mutationKey: ["submission", "confirmation-email"],
    mutationFn: postConfirmationEmail,
    onSuccess: () => {
      markCompletionStatus(getOpsForCompleteStatus("success"));
    },
    onError: () => markCompletionStatus(getOpsForCompleteStatus("failed")),
  });

  const { status: submitStatus, data: submitData } = useQuery({
    queryKey: ["submission", "form-data"],
    queryFn: () =>
      postFormDataToApi({
        clientId: clientId ?? 0,
        creditCard: creditCardState,
        driversLicense: driverLicenseState,
        rentalSignature: rentalSignatureState,
        customerId: customerId ?? 0,
        referenceId: referenceId ?? 0,
        referenceType,
        rental: rentalData,
        attachmentOptions: {
          stopAttachingDriverLicenseFiles: isDriverLicenseAttachmentsStopped,
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  useEffect(() => {
    if (submitStatus === "success") {
      const data = submitData;

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
          fromName: confirmationEmail.fromName,
          globalDocuments: isGlobalDocumentsStopped === false && fetchedGlobalDocuments ? fetchedGlobalDocuments : [],
          attachments: data.oneOffAttachmentsToUpload,
        });
        return;
      }
      markCompletionStatus(getOpsForCompleteStatus("success"));
    }
  }, [
    submitStatus,
    submitData,
    t,
    getOpsForCompleteStatus,
    markCompletionStatus,
    sendConfirmationEmail,
    responseTemplateId,
    confirmationEmail,
    clientId,
    adminUserId,
    referenceId,
    referenceType,
    isGlobalDocumentsStopped,
    fetchedGlobalDocuments,
  ]);

  useEffect(() => {
    if (submitStatus === "error") {
      markCompletionStatus(getOpsForCompleteStatus("failed"));
    }
  }, [submitStatus, getOpsForCompleteStatus, markCompletionStatus]);

  return <LoadingSubmission title={currentMessage} />;
};

export default PostFormDataControllerDefault;
