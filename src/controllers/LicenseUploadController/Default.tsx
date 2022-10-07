import React, { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "../../layouts/Card";
import Alert from "../../components/Elements/Default/Alert";
import ImageDropzoneWithPreviewDefault from "../../components/ImageDropzoneWithPreview/Default";
import Button from "../../components/Elements/Default/Button";
import { GoBackConfirmationDialog } from "../../components/Dialogs";

import { useDriverLicenseLogic } from "../../hooks/logic/useDriverLicenseLogic";
import { useFormStore } from "../../hooks/stores/useFormStore";
import { useDialogStore } from "../../hooks/stores/useDialogStore";
import { useAppNavContext } from "../../hooks/logic/useAppNavContext";

interface IProps {}

const DefaultLicenseUploadController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const clearFormState = useFormStore((s) => s.clearFormStateKey);
  const setDriversLicenseToStore = useFormStore((s) => s.setDriversLicense);
  const initialDriverLicenseData = useFormStore((s) => s.driversLicense.data);
  const { setBackConfirmationDialogState, isBackConfirmationDialogOpen } = useDialogStore();

  const {
    frontLicenseImage,
    backLicenseImage,
    setFrontImageError,
    setBackImageError,
    noFrontImageError,
    noBackImageError,
    setFrontImage,
    setBackImage,
    clearFrontImage,
    clearBackImage,
  } = useDriverLicenseLogic({
    frontImageDataUrl: initialDriverLicenseData.frontImageUrl,
    frontImageName: initialDriverLicenseData.frontImageName,
    backImageDataUrl: initialDriverLicenseData.backImageUrl,
    backImageName: initialDriverLicenseData.backImageName,
  });

  // General component state
  const handleNextState = useCallback(() => {
    if (!frontLicenseImage) setFrontImageError(true);
    if (!backLicenseImage) setBackImageError(true);
    if (!frontLicenseImage || !backLicenseImage) return;

    setDriversLicenseToStore({
      frontImageUrl: URL.createObjectURL(frontLicenseImage),
      backImageUrl: URL.createObjectURL(backLicenseImage),
      frontImageName: frontLicenseImage.name,
      backImageName: backLicenseImage.name,
    });
    goNext();
  }, [frontLicenseImage, backLicenseImage, setFrontImageError, setBackImageError, setDriversLicenseToStore, goNext]);

  const dismissBackDialog = useCallback(() => {
    setBackConfirmationDialogState(false);
  }, [setBackConfirmationDialogState]);

  const confirmBackDialog = useCallback(() => {
    if (mode === "navigate") {
      clearFormState("driversLicense");
    }
    setBackConfirmationDialogState(false);
    goPrev();
  }, [clearFormState, goPrev, mode, setBackConfirmationDialogState]);

  const handleOpenModalConfirmation = useCallback(() => {
    if (mode === "save") {
      // if (initialDriverLicenseData.frontImageName !== frontLicenseImage.name) || (initialDriverLicenseData.backImageName !== backLicenseImage.name), then open modal
      if (
        initialDriverLicenseData.frontImageName !== frontLicenseImage?.name ||
        initialDriverLicenseData.backImageName !== backLicenseImage?.name
      ) {
        setBackConfirmationDialogState(true);
        return;
      }

      // if (initialDriverLicenseData.frontImageName === frontLicenseImage.name && initialDriverLicenseData.backImageName === backLicenseImage.name) then go back
      goPrev();
      return;
    }

    if (mode === "navigate") {
      // if (frontImageFile || backImageFile), then open modal
      if (backLicenseImage || frontLicenseImage) {
        setBackConfirmationDialogState(true);
        return;
      }

      // if (!frontImageFile && !backImageFile), then go back
      goPrev();
    }
  }, [
    backLicenseImage,
    frontLicenseImage,
    goPrev,
    initialDriverLicenseData.backImageName,
    initialDriverLicenseData.frontImageName,
    mode,
    setBackConfirmationDialogState,
  ]);

  return (
    <Fragment>
      <GoBackConfirmationDialog
        isOpen={isBackConfirmationDialogOpen}
        title={t("forms.licenseUpload.goBack.title")}
        message={t("forms.licenseUpload.goBack.message")}
        onCancel={dismissBackDialog}
        onConfirm={confirmBackDialog}
        cancelBtnText={t("forms.licenseUpload.goBack.cancel")}
        confirmBtnText={t("forms.licenseUpload.goBack.submit")}
      />
      <CardLayout title={t("forms.licenseUpload.title")} subtitle={t("forms.licenseUpload.message")}>
        <div className="mt-3 grid grid-cols-1 gap-4">
          <div>
            <h2 className="mb-2 text-base text-gray-500">{t("forms.licenseUpload.frontImage.title")}</h2>
            <div>
              {noFrontImageError && (
                <Alert variant="danger" fullWidth>
                  {t("forms.licenseUpload.frontImage.notSelected")}
                </Alert>
              )}
              <ImageDropzoneWithPreviewDefault
                dragDisplayText={t("forms.licenseUpload.frontImage.drag")}
                selectButtonText={t("forms.licenseUpload.frontImage.select")}
                clearButtonText={t("forms.licenseUpload.frontImage.clear")}
                onSelectFile={setFrontImage}
                onClearFile={clearFrontImage}
                acceptOnly={{
                  "image/jpeg": [".jpeg"],
                  "image/jpg": [".jpg"],
                  "image/png": [".png"],
                }}
                initialPreview={
                  initialDriverLicenseData.frontImageUrl
                    ? {
                        fileName: initialDriverLicenseData.frontImageName!,
                        url: initialDriverLicenseData.frontImageUrl,
                      }
                    : null
                }
                navMode={mode}
              />
            </div>
          </div>
          <div className="mt-2">
            <hr />
          </div>
          <div className="mt-2">
            <h2 className="mb-2 text-base text-gray-500">{t("forms.licenseUpload.backImage.title")}</h2>
            <div>
              {noBackImageError && (
                <Alert variant="danger" fullWidth>
                  {t("forms.licenseUpload.backImage.notSelected")}
                </Alert>
              )}
              <ImageDropzoneWithPreviewDefault
                dragDisplayText={t("forms.licenseUpload.backImage.drag")}
                selectButtonText={t("forms.licenseUpload.backImage.select")}
                clearButtonText={t("forms.licenseUpload.backImage.clear")}
                onSelectFile={setBackImage}
                onClearFile={clearBackImage}
                acceptOnly={{
                  "image/jpeg": [".jpeg"],
                  "image/jpg": [".jpg"],
                  "image/png": [".png"],
                }}
                initialPreview={
                  initialDriverLicenseData.backImageUrl
                    ? {
                        fileName: initialDriverLicenseData.backImageName!,
                        url: initialDriverLicenseData.backImageUrl,
                      }
                    : null
                }
                navMode={mode}
              />
            </div>
          </div>
          <div className="mt-1 flex">
            {isPreviousAvailable && (
              <div className="pr-0">
                <Button color="primary" variant="muted" size="lg" onClick={handleOpenModalConfirmation}>
                  {prevPageText}
                </Button>
              </div>
            )}
            <div className={isPreviousAvailable ? "flex-1 pl-2" : "flex-1"}>
              <Button color="primary" size="lg" onClick={handleNextState}>
                {nextPageText}
              </Button>
            </div>
          </div>
        </div>
      </CardLayout>
    </Fragment>
  );
};
export default DefaultLicenseUploadController;
