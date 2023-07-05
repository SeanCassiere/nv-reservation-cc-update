import React, { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import ImageDropzoneWithPreview from "@/components/image-dropzone-with-preview";
import { ExclamationIcon } from "@/components/Icons";
import { GoBackConfirmationDialog } from "@/components/go-back-confirmation-dialog";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button as UIButton } from "@/components/ui/button";

import { useDriverLicenseLogic } from "@/hooks/logic/useDriverLicenseLogic";
import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useFormStore } from "@/hooks/stores/useFormStore";
import { useDialogStore } from "@/hooks/stores/useDialogStore";

interface IProps {}

const DefaultLicenseUploadController: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const initialDriverLicenseData = useFormStore((s) => s.driversLicense.data);
  const { setBackConfirmationDialogState, isBackConfirmationDialogOpen } = useDialogStore();

  const {
    frontLicenseImage,
    backLicenseImage,
    noFrontImageError,
    noBackImageError,
    setFrontImage,
    setBackImage,
    clearFrontImage,
    clearBackImage,
    clearLicenseImagesFromStore,
    saveLicenseImagesToStore,
  } = useDriverLicenseLogic(
    {
      frontImageDataUrl: initialDriverLicenseData.frontImageUrl,
      frontImageName: initialDriverLicenseData.frontImageName,
      backImageDataUrl: initialDriverLicenseData.backImageUrl,
      backImageName: initialDriverLicenseData.backImageName,
    },
    mode
  );

  // General component state
  const handleNextState = useCallback(() => {
    const result = saveLicenseImagesToStore();
    if (!result) return;

    goNext();
  }, [saveLicenseImagesToStore, goNext]);

  const dismissBackDialog = useCallback(() => {
    setBackConfirmationDialogState(false);
  }, [setBackConfirmationDialogState]);

  const confirmBackDialog = useCallback(() => {
    if (mode === "navigate") {
      clearLicenseImagesFromStore();
    }
    setBackConfirmationDialogState(false);
    goPrev();
  }, [clearLicenseImagesFromStore, goPrev, mode, setBackConfirmationDialogState]);

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
            <h2 className="mb-2 text-base text-primary">{t("forms.licenseUpload.frontImage.title")}</h2>
            <div>
              {noFrontImageError && (
                <Alert className="mb-1" variant="warning">
                  <ExclamationIcon />
                  <AlertTitle>{t("forms.licenseUpload.missing")}</AlertTitle>
                  <AlertDescription>{t("forms.licenseUpload.frontImage.notSelected")}</AlertDescription>
                </Alert>
              )}

              <ImageDropzoneWithPreview
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
                  initialDriverLicenseData.frontImageUrl && initialDriverLicenseData.frontImageName
                    ? {
                        fileName: initialDriverLicenseData.frontImageName,
                        url: initialDriverLicenseData.frontImageUrl,
                      }
                    : null
                }
              />
            </div>
          </div>
          <div className="mt-2">
            <hr />
          </div>
          <div className="mt-2">
            <h2 className="mb-2 text-base text-primary">{t("forms.licenseUpload.backImage.title")}</h2>
            <div>
              {noBackImageError && (
                <Alert className="mb-1" variant="warning">
                  <ExclamationIcon />
                  <AlertTitle>{t("forms.licenseUpload.missing")}</AlertTitle>
                  <AlertDescription>{t("forms.licenseUpload.backImage.notSelected")}</AlertDescription>
                </Alert>
              )}
              <ImageDropzoneWithPreview
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
                  initialDriverLicenseData.backImageUrl && initialDriverLicenseData.backImageName
                    ? {
                        fileName: initialDriverLicenseData.backImageName,
                        url: initialDriverLicenseData.backImageUrl,
                      }
                    : null
                }
              />
            </div>
          </div>
          <div className="mt-1 flex">
            {isPreviousAvailable && (
              <div className="pr-0">
                <UIButton variant="outline" onClick={handleOpenModalConfirmation}>
                  {prevPageText}
                </UIButton>
              </div>
            )}
            <div className={isPreviousAvailable ? "flex-1 pl-2" : "flex-1"}>
              <UIButton onClick={handleNextState} className="w-full">
                {nextPageText}
              </UIButton>
            </div>
          </div>
        </div>
      </CardLayout>
    </Fragment>
  );
};
export default DefaultLicenseUploadController;
