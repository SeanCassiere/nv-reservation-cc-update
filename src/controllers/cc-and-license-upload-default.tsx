import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout, { CardTitleHeading, CardSubtitleSpan } from "@/components/card-layout";
import ImageDropzoneWithPreview from "@/components/image-dropzone-with-preview";
import DynamicCreditCard from "@/components/dynamic-credit-card";
import CreditCardDetailsForm from "@/components/credit-card-details-form";

import { Button as UIButton } from "@/components/ui/button";
import { GoBackConfirmationDialog } from "@/components/go-back-confirmation-dialog";
import { Form } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationIcon } from "@/components/ui/icons";

import { useCreditCardLogic } from "@/hooks/logic/useCreditCardLogic";
import { useDriverLicenseLogic } from "@/hooks/logic/useDriverLicenseLogic";
import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useFormStore } from "@/hooks/stores/useFormStore";
import { useDialogStore } from "@/hooks/stores/useDialogStore";

interface IProps {}

const DefaultCreditCardAndLicenseUploadController: React.FC<IProps> = () => {
  const { t } = useTranslation();

  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const setCustomerCreditCardToStore = useFormStore((s) => s.setCustomerCreditCard);
  const initialCreditCardFormData = useFormStore((s) => s.customerCreditCard.data);
  const initialDriverLicenseData = useFormStore((s) => s.driversLicense.data);
  const { setBackConfirmationDialogState, isBackConfirmationDialogOpen } = useDialogStore();

  // credit card relate handlers
  const { form, currentFocus, changeCurrentFocus } = useCreditCardLogic(initialCreditCardFormData);
  const cardValues = form.watch();

  // license related handlers
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
    mode
  );

  // validate the form data against the schema
  const handleNextState = form.handleSubmit((values) => {
    const saveLicenseImagesResult = saveLicenseImagesToStore();
    if (!saveLicenseImagesResult) return;

    setCustomerCreditCardToStore(values);
    goNext();
  });

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
    <Form {...form}>
      <form onSubmit={handleNextState}>
        <GoBackConfirmationDialog
          isOpen={isBackConfirmationDialogOpen}
          title={t("forms.licenseUpload.goBack.title")}
          message={t("forms.licenseUpload.goBack.message")}
          onCancel={dismissBackDialog}
          onConfirm={confirmBackDialog}
          cancelBtnText={t("forms.licenseUpload.goBack.cancel")}
          confirmBtnText={t("forms.licenseUpload.goBack.submit")}
        />
        <CardLayout>
          {/* Credit card form */}
          <div>
            <CardTitleHeading>{t("forms.creditCard.title")}</CardTitleHeading>
            <CardSubtitleSpan>{t("forms.creditCard.message")}</CardSubtitleSpan>
            <div className="mt-4 grid grid-cols-1">
              <div className="my-4 md:my-2">
                <DynamicCreditCard currentFocus={currentFocus} formData={cardValues} />
              </div>
              <div className="mt-4">
                <CreditCardDetailsForm form={form} changeCurrentFocus={changeCurrentFocus} />
              </div>
            </div>
          </div>
          {/* License Upload Form */}
          <div className="mt-7">
            <hr />
          </div>
          <div className="pt-5">
            <CardTitleHeading>{t("forms.licenseUpload.title")}</CardTitleHeading>
            <CardSubtitleSpan>{t("forms.licenseUpload.message")}</CardSubtitleSpan>
            <div className="d-grid mt-4">
              <div>
                <h2 className="mb-2 text-base text-primary/90">{t("forms.licenseUpload.frontImage.title")}</h2>
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
              <div className="mt-6">
                <h2 className="mb-2 text-base text-primary/90">{t("forms.licenseUpload.backImage.title")}</h2>
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
            </div>
          </div>
          {/* Navigation */}
          <div className="mt-6 flex">
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
        </CardLayout>
      </form>
    </Form>
  );
};

export default DefaultCreditCardAndLicenseUploadController;
