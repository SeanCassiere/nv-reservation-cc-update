import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import CardLayout, { CardTitleHeading, CardSubtitleSpan } from "@/components/card-layout";
import ImageDropzoneWithPreview from "@/components/image-dropzone-with-preview";
import DynamicCreditCard from "@/components/dynamic-credit-card";
import CreditCardDetailsForm from "@/components/credit-card-details-form";

import { Button as UIButton } from "@/components/ui/button";
import { GoBackConfirmationDialog } from "@/components/dialogs";
import { Form } from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationIcon } from "@/components/icons";

import { useCreditCardLogic } from "@/hooks/logic/useCreditCardLogic";
import { useDriverLicenseLogic } from "@/hooks/logic/useDriverLicenseLogic";
import { useAppNavContext } from "@/hooks/logic/useAppNavContext";
import { useFormStore } from "@/hooks/stores/useFormStore";
import { useDialogStore } from "@/hooks/stores/useDialogStore";

interface IProps {}

const DefaultCreditCardAndLicenseUploadController: React.FC<IProps> = () => {
  const { t } = useTranslation();
  const clearFormState = useFormStore((s) => s.clearFormStateKey);
  const { nextPageText, prevPageText, isPreviousAvailable, goPrev, goNext, mode } = useAppNavContext();

  const setDriversLicenseToStore = useFormStore((s) => s.setDriversLicense);
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

  // validate the form data against the schema
  const handleNextState = form.handleSubmit(
    (values) => {
      if (!frontLicenseImage) setFrontImageError(true);
      if (!backLicenseImage) setBackImageError(true);
      if (!backLicenseImage || !frontLicenseImage) {
        return;
      }

      setCustomerCreditCardToStore(values);
      setDriversLicenseToStore({
        frontImageUrl: URL.createObjectURL(frontLicenseImage),
        backImageUrl: URL.createObjectURL(backLicenseImage),
        frontImageName: frontLicenseImage.name,
        backImageName: backLicenseImage.name,
      });

      goNext();
    },
    () => {
      if (!frontLicenseImage) setFrontImageError(true);
      if (!backLicenseImage) setBackImageError(true);
      if (!backLicenseImage || !frontLicenseImage) {
        return;
      }
    }
  );

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
                <h2 className="mb-2 text-base text-gray-500">{t("forms.licenseUpload.frontImage.title")}</h2>
                <div>
                  {noFrontImageError && (
                    <Alert className="mb-1" variant="destructive">
                      <ExclamationIcon />
                      <AlertTitle>Missing</AlertTitle>
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
                    navMode={mode}
                  />
                </div>
              </div>
              <div className="mt-6">
                <h2 className="mb-2 text-base text-gray-500">{t("forms.licenseUpload.backImage.title")}</h2>
                <div>
                  {noBackImageError && (
                    <Alert className="mb-1" variant="destructive">
                      <ExclamationIcon />
                      <AlertTitle>Missing</AlertTitle>
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
                    navMode={mode}
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
