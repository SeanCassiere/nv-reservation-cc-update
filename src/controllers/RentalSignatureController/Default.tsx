import React, { Fragment, useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import Alert from "../../components/Elements/Default/Alert";
import SignatureCanvasDefault from "../../components/SignatureCanvas/Default";
import Button from "../../components/Elements/Default/Button";
import { GoBackConfirmationDialog } from "../../components/Dialogs";

import { APP_CONSTANTS } from "../../utils/constants";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { useRentalSavedDigitalSignature } from "../../hooks/network/useRentalSavedDigitalSignature";
import { useDialogStore } from "../../hooks/stores/useDialogStore";
import { useAppNavContext } from "../../hooks/logic/useAppNavContext";

interface IProps {}

const DefaultRentalSignatureController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const clearFormState = useFormStore((s) => s.clearFormStateKey);
  const setRentalSignature = useFormStore((s) => s.setRentalSignature);
  const initialSignatureUrl = useFormStore((s) => s.rentalSignature.data.signatureUrl);
  const referenceType = useRuntimeStore((s) => s.referenceType);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);
  const isCheckInStoreValue = useRuntimeStore((s) => s.rental?.isCheckIn);
  const { setBackConfirmationDialogState, isBackConfirmationDialogOpen } = useDialogStore();

  const isCheckIn = useMemo(() => isCheckInStoreValue ?? false, [isCheckInStoreValue]);

  const [signatureUrl, setSignatureUrl] = useState("");

  const [showRequiredMessage, setShowRequiredMessage] = useState(false);

  const handleNextState = useCallback(() => {
    if (signatureUrl === "") {
      setShowRequiredMessage(true);
      return;
    }

    setRentalSignature({ signatureUrl });
    goNext();
  }, [goNext, setRentalSignature, signatureUrl]);

  const handleSettingSignatureUrl = useCallback((url: string) => {
    if (url === "") {
      setSignatureUrl("");
    } else {
      setShowRequiredMessage(false);
      setSignatureUrl(url);
    }
  }, []);

  const dismissBackDialog = useCallback(() => {
    setBackConfirmationDialogState(false);
  }, [setBackConfirmationDialogState]);

  const confirmBackDialog = useCallback(() => {
    if (mode === "navigate") {
      clearFormState("rentalSignature");
    }
    setBackConfirmationDialogState(false);
    goPrev();
  }, [clearFormState, goPrev, mode, setBackConfirmationDialogState]);

  // function invoked when clicking the back btn
  const handleOpenModalConfirmation = useCallback(() => {
    if (mode === "save") {
      // signatureUrl !== '' && signatureUrl !== savedSignatureUrl, then open modal
      if (signatureUrl !== "" && initialSignatureUrl !== signatureUrl) {
        setBackConfirmationDialogState(true);
        return;
      }

      // if mode === save && signatureUrl === savedSignatureUrl, then goPrev()
      goPrev();
      return;
    }

    if (mode === "navigate") {
      // if mode === navigate && signatureUrl !== "", then open modal
      if (signatureUrl !== "") {
        setBackConfirmationDialogState(true);
        return;
      }

      // if mode === navigate && signatureUrl === "", then goPrev()
      goPrev();
      return;
    }
  }, [goPrev, initialSignatureUrl, mode, setBackConfirmationDialogState, signatureUrl]);

  useRentalSavedDigitalSignature(
    { referenceType, referenceId: `${referenceId}`, isCheckIn },
    {
      enabled: initialSignatureUrl === "",
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      onSuccess: (url) => {
        if (url) {
          setRentalSignature({ signatureUrl: url });
        }
      },
    }
  );

  useEffect(() => {
    if (initialSignatureUrl !== "") {
      setSignatureUrl(initialSignatureUrl);
    }
  }, [initialSignatureUrl]);

  return (
    <Fragment>
      <GoBackConfirmationDialog
        isOpen={isBackConfirmationDialogOpen}
        title={t("forms.rentalSignature.goBack.title")}
        message={t("forms.rentalSignature.goBack.message")}
        onCancel={dismissBackDialog}
        onConfirm={confirmBackDialog}
        cancelBtnText={t("forms.rentalSignature.goBack.cancel")}
        confirmBtnText={t("forms.rentalSignature.goBack.submit")}
      />
      <CardLayout
        title={t("forms.rentalSignature.title", {
          context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
        subtitle={t("forms.rentalSignature.message", {
          context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
        })}
      >
        <div className="d-grid mt-3">
          {showRequiredMessage && <Alert color="danger">{t("forms.rentalSignature.signatureRequired")}</Alert>}
          <SignatureCanvasDefault
            onSignature={handleSettingSignatureUrl}
            initialDataURL={initialSignatureUrl !== "" ? initialSignatureUrl : undefined}
          />
          <div className="mt-6 flex">
            {isPreviousAvailable && (
              <div className="pr-0">
                <Button color="primary" variant="muted" size="lg" onClick={handleOpenModalConfirmation}>
                  {prevPageText}
                </Button>
              </div>
            )}
            <div className={isPreviousAvailable ? "flex-1 pl-2" : "flex-1"}>
              <Button color="primary" size="lg" disabled={signatureUrl === ""} onClick={handleNextState}>
                {nextPageText}
              </Button>
            </div>
          </div>
        </div>
      </CardLayout>
    </Fragment>
  );
};

export default DefaultRentalSignatureController;
