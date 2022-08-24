import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { selectCreditCardForm, selectLicenseUploadForm } from "../../redux/store";
import { clearReduxFormState, setCreditCardFormData, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import useCreditCardLogic from "../../hooks/useCreditCardLogic";
import { urlToBlob } from "../../utils/blobUtils";

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

  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [displayNoFrontImageError, setDisplayNoFrontImageError] = useState(false);

  // if available in redux, setting the front image file
  useEffect(() => {
    if (frontImageUrl) {
      (async () => {
        const blob = await urlToBlob(frontImageUrl);
        const file = new File([blob], frontImageName!);
        setFrontImageFile(file);
      })();
    }
  }, [frontImageName, frontImageUrl]);

  const selectFrontImage = useCallback(async (file: File) => {
    setDisplayNoFrontImageError(false);
    setFrontImageFile(file);
  }, []);

  const clearFrontImage = useCallback(() => {
    setFrontImageFile(null);
  }, []);

  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [displayNoBackImageError, setDisplayNoBackImageError] = useState(false);

  // if available in redux, setting the back image file
  useEffect(() => {
    if (backImageUrl) {
      (async () => {
        const blob = await urlToBlob(backImageUrl);
        const file = new File([blob], backImageName!);
        setBackImageFile(file);
      })();
    }
  }, [backImageName, backImageUrl]);

  const selectBackImage = useCallback((file: File) => {
    setDisplayNoBackImageError(false);
    setBackImageFile(file);
  }, []);

  const clearBackImage = useCallback(() => {
    setBackImageFile(null);
  }, []);

  const handleOpenModalConfirmation = useCallback(() => {
    if (
      (backImageFile || frontImageFile) &&
      window.confirm(t("forms.licenseUpload.goBack.title") + "\n" + t("forms.licenseUpload.goBack.message"))
    ) {
      dispatch(clearReduxFormState("licenseUploadForm"));
      handlePrevious();
    }

    if (!backImageFile && !frontImageFile) {
      handlePrevious();
    }
  }, [backImageFile, dispatch, frontImageFile, handlePrevious, t]);

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    const formValid = await isValidCheck();
    if (!frontImageFile) setDisplayNoFrontImageError(true);
    if (!backImageFile) setDisplayNoBackImageError(true);

    if (!backImageFile || !frontImageFile || !formValid) {
      await validateCardData((values) => {
        dispatch(setCreditCardFormData(values));
      });
      return;
    }

    dispatch(
      setLicenseUploadFormData({
        frontImageUrl: URL.createObjectURL(frontImageFile),
        backImageUrl: URL.createObjectURL(backImageFile),
        frontImageName: frontImageFile.name,
        backImageName: backImageFile.name,
      })
    );

    handleSubmit();
  }, [backImageFile, dispatch, frontImageFile, handleSubmit, isValidCheck, validateCardData]);

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
                {displayNoFrontImageError && (
                  <Alert variant="danger">{t("forms.licenseUpload.frontImage.notSelected")}</Alert>
                )}

                <DefaultImageDropzoneWithPreview
                  dragDisplayText={t("forms.licenseUpload.frontImage.drag")}
                  selectButtonText={t("forms.licenseUpload.frontImage.select")}
                  clearButtonText={t("forms.licenseUpload.frontImage.clear")}
                  onSelectFile={selectFrontImage}
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
                {displayNoBackImageError && (
                  <Alert variant="danger">{t("forms.licenseUpload.backImage.notSelected")}</Alert>
                )}
                <DefaultImageDropzoneWithPreview
                  dragDisplayText={t("forms.licenseUpload.backImage.drag")}
                  selectButtonText={t("forms.licenseUpload.backImage.select")}
                  clearButtonText={t("forms.licenseUpload.backImage.clear")}
                  onSelectFile={selectBackImage}
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
