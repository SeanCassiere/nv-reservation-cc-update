import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import Alert from "../../components/Elements/Default/Alert";
import SignatureCanvasDefault from "../../components/SignatureCanvas/Default";
import Button from "../../components/Elements/Default/Button";

import { APP_CONSTANTS } from "../../utils/constants";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";
import { useRentalSavedDigitalSignature } from "../../hooks/network/useRentalSavedDigitalSignature";
import { useAppNavContext } from "../../hooks/logic/useAppNavContext";

interface IProps {}

const DefaultRentalSignatureController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext } = useAppNavContext();

  const clearFormState = useFormStore((s) => s.clearFormStateKey);
  const setRentalSignature = useFormStore((s) => s.setRentalSignature);
  const initialSignatureUrl = useFormStore((s) => s.rentalSignature.data.signatureUrl);
  const referenceType = useRuntimeStore((s) => s.referenceType);
  const referenceId = useRuntimeStore((s) => s.referenceIdentifier);

  const [signatureUrl, setSignatureUrl] = React.useState("");

  const [showRequiredMessage, setShowRequiredMessage] = React.useState(false);

  const handleNextState = React.useCallback(() => {
    if (signatureUrl === "") {
      setShowRequiredMessage(true);
      return;
    }

    setRentalSignature({ signatureUrl });
    goNext();
  }, [goNext, setRentalSignature, signatureUrl]);

  const handleOpenModalConfirmation = React.useCallback(() => {
    if (
      signatureUrl !== "" &&
      window.confirm(t("forms.rentalSignature.goBack.title") + "\n" + t("forms.rentalSignature.goBack.message"))
    ) {
      clearFormState("rentalSignature");
      goPrev();
    }

    if (signatureUrl === "") {
      goPrev();
    }
  }, [clearFormState, goPrev, signatureUrl, t]);

  const handleSettingSignatureUrl = React.useCallback((url: string) => {
    if (url === "") {
      setSignatureUrl("");
    } else {
      setShowRequiredMessage(false);
      setSignatureUrl(url);
    }
  }, []);

  useRentalSavedDigitalSignature(
    { referenceType, referenceId: `${referenceId}` },
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
    <CardLayout
      title={t("forms.rentalSignature.title", {
        context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
      subtitle={t("forms.rentalSignature.message", {
        context: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
    >
      <div className="mt-3 d-grid">
        {showRequiredMessage && <Alert variant="danger">{t("forms.rentalSignature.signatureRequired")}</Alert>}
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
          <div className={isPreviousAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button color="primary" size="lg" disabled={signatureUrl === ""} onClick={handleNextState}>
              {nextPageText}
            </Button>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultRentalSignatureController;
