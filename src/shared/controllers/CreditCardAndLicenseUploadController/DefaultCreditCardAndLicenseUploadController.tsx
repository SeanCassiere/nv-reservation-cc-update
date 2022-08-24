import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectCreditCardForm, selectLicenseUploadForm } from "../../redux/store";
import { clearReduxFormState, setCreditCardFormData, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import useCreditCardLogic from "../../hooks/useCreditCardLogic";
import { useDriverLicenseLogic } from "../../hooks/useDriverLicenseLogic";

import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import DefaultCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";
import Button from "../../components/Elements/Button";
import CardLayout, { cardSubtitleClassNames, cardTitleClassNames } from "../../layouts/Card";
import Alert from "../../components/Elements/Alert";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultCreditCardAndLicenseUploadController: React.FC<IProps> = ({
  handleSubmit,
  isNextAvailable,
  handlePrevious,
  isPrevPageAvailable,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: initialFormData } = useSelector(selectCreditCardForm);

  const {
    validateCardData,
    handleCardInputChange,
    handleCardInputBlur,
    handleCardInputFocus,
    isValidCheck,
    currentFocus,
    schemaErrors,
    formValues,
  } = useCreditCardLogic(initialFormData);

  // license related handlers
  const {
    data: { frontImageName, frontImageUrl, backImageName, backImageUrl },
  } = useSelector(selectLicenseUploadForm);

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
    frontImageDataUrl: frontImageUrl,
    frontImageName,
    backImageDataUrl: backImageUrl,
    backImageName,
  });

  const handleOpenModalConfirmation = useCallback(() => {
    if (
      (backLicenseImage || frontLicenseImage) &&
      window.confirm(t("forms.licenseUpload.goBack.title") + "\n" + t("forms.licenseUpload.goBack.message"))
    ) {
      dispatch(clearReduxFormState("licenseUploadForm"));
      handlePrevious();
    }

    if (!backLicenseImage && !frontLicenseImage) {
      handlePrevious();
    }
  }, [backLicenseImage, dispatch, frontLicenseImage, handlePrevious, t]);

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    const formValid = await isValidCheck();
    if (!frontLicenseImage) setFrontImageError(true);
    if (!backLicenseImage) setBackImageError(true);

    if (!backLicenseImage || !frontLicenseImage || !formValid) {
      await validateCardData((values) => {
        dispatch(setCreditCardFormData(values));
      });
      return;
    }

    dispatch(
      setLicenseUploadFormData({
        frontImageUrl: URL.createObjectURL(frontLicenseImage),
        backImageUrl: URL.createObjectURL(backLicenseImage),
        frontImageName: frontLicenseImage.name,
        backImageName: backLicenseImage.name,
      })
    );

    handleSubmit();
  }, [
    backLicenseImage,
    dispatch,
    frontLicenseImage,
    handleSubmit,
    isValidCheck,
    setBackImageError,
    setFrontImageError,
    validateCardData,
  ]);

  return (
    <React.Fragment>
      <CardLayout>
        {/* Credit card form */}
        <div>
          <h1 className={cardTitleClassNames}>{t("forms.creditCard.title")}</h1>
          <span className={cardSubtitleClassNames}>{t("forms.creditCard.message")}</span>
          <div className="mt-4 grid grid-cols-1">
            <div className="my-4 md:my-2">
              <DefaultCreditCard currentFocus={currentFocus} formData={formValues} />
            </div>
            <div className="mt-4">
              <DefaultCardDetailsForm
                formData={formValues}
                handleChange={handleCardInputChange}
                handleBlur={handleCardInputBlur}
                handleFocus={handleCardInputFocus}
                schemaErrors={schemaErrors}
              />
            </div>
          </div>
        </div>
        {/* License Upload Form */}
        <div className="mt-7">
          <hr />
        </div>
        <div className="pt-5">
          <h1 className={cardTitleClassNames}>{t("forms.licenseUpload.title")}</h1>
          <span className={cardSubtitleClassNames}>{t("forms.licenseUpload.message")}</span>
          <div className="mt-4 d-grid">
            <div>
              <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.frontImage.title")}</h2>
              <div>
                {noFrontImageError && <Alert variant="danger">{t("forms.licenseUpload.frontImage.notSelected")}</Alert>}

                <DefaultImageDropzoneWithPreview
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
                  initialPreview={frontImageUrl ? { fileName: frontImageName!, url: frontImageUrl } : null}
                />
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.backImage.title")}</h2>
              <div>
                {noBackImageError && <Alert variant="danger">{t("forms.licenseUpload.backImage.notSelected")}</Alert>}
                <DefaultImageDropzoneWithPreview
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
                  initialPreview={backImageUrl ? { fileName: backImageName!, url: backImageUrl } : null}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Navigation */}
        <div className="mt-6 flex">
          {isPrevPageAvailable && (
            <div className="pr-0">
              <Button color="primary" variant="muted" size="lg" onClick={handleOpenModalConfirmation}>
                &#8592;
              </Button>
            </div>
          )}
          <div className={isPrevPageAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button color="primary" size="lg" onClick={handleNextState}>
              {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
            </Button>
          </div>
        </div>
      </CardLayout>
    </React.Fragment>
  );
};

export default DefaultCreditCardAndLicenseUploadController;
