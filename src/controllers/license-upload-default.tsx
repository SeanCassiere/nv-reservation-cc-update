import React, { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout from "@/components/card-layout";
import { GoBackConfirmationDialog } from "@/components/go-back-confirmation-dialog";
import ImageDropzoneWithPreview from "@/components/image-dropzone-with-preview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button as UIButton } from "@/components/ui/button";
import { ExclamationIcon } from "@/components/ui/icons";

import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useDriverLicenseLogic } from "@/hooks/logic/useDriverLicenseLogic";
import { useDialogStore } from "@/hooks/stores/useDialogStore";
import { useFormStore } from "@/hooks/stores/useFormStore";

interface IProps {}

const DefaultLicenseUploadController: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const initialDriverLicenseData = useFormStore((s) => s.driversLicense.data);
  const { setBackConfirmationDialogState, isBackConfirmationDialogOpen } = useDialogStore();

  const {
    frontLicenseImage,
    backLicenseImage,
    isFrontImageError,
    isBackImageError,
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
    mode,
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
      // on save, if the driver license data in storage is NOT THE SAME as what is in state then open the modal.
      if (
        initialDriverLicenseData.frontImageName !== frontLicenseImage?.fileName ||
        initialDriverLicenseData.backImageName !== backLicenseImage?.fileName
      ) {
        setBackConfirmationDialogState(true);
        return;
      }

      goPrev();
    }

    if (mode === "navigate") {
      // if driver licenses have been added, then open the modal
      if (backLicenseImage || frontLicenseImage) {
        setBackConfirmationDialogState(true);
        return;
      }

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
        message={t("forms.licenseUpload.goBack.message", { context: mode === "save" ? "edit" : "" })}
        onCancel={dismissBackDialog}
        onConfirm={confirmBackDialog}
        cancelBtnText={t("forms.licenseUpload.goBack.cancel")}
        confirmBtnText={t("forms.licenseUpload.goBack.submit")}
      />
      <CardLayout title={t("forms.licenseUpload.title")} subtitle={t("forms.licenseUpload.message")}>
        <div className="mt-3 grid grid-cols-1 gap-4">
          <div>
            <h2 className="mb-2 text-base text-foreground">{t("forms.licenseUpload.frontImage.title")}</h2>
            <div>
              {isFrontImageError && (
                <Alert className="mb-2" variant="warning">
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
                        dataUrl: initialDriverLicenseData.frontImageUrl,
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
            <h2 className="mb-2 text-base text-foreground">{t("forms.licenseUpload.backImage.title")}</h2>
            <div>
              {isBackImageError && (
                <Alert className="mb-2" variant="warning">
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
                        dataUrl: initialDriverLicenseData.backImageUrl,
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
