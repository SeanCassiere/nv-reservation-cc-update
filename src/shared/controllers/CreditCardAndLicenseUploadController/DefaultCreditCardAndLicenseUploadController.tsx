import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

import { selectCreditCardForm, selectLicenseUploadForm } from "../../redux/store";
import { clearReduxFormState, setCreditCardFormData, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import { creditCardTypeFormat } from "../../utils/creditCardTypeFormat";
import useCreditCardSchema from "../../hooks/useCreditCardSchema";
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

const DefaultCreditCardAndLicenseUploadController = ({
  handleSubmit,
  isNextAvailable,
  handlePrevious,
  isPrevPageAvailable,
}: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: initialFormData } = useSelector(selectCreditCardForm);

  const [formValues, setFormValues] = useState(initialFormData);
  const [schemaErrors, setSchemaErrors] = useState<YupErrorsFormatted>([]);
  const [cardMaxLength, setCardMaxLength] = useState(16);

  const [currentFocus, setCurrentFocus] = useState<string>("");

  const { schema } = useCreditCardSchema();

  // Form element handlers
  const handleCardIdentifier = useCallback(
    (type: string, maxLength: number) => {
      const formattedType = creditCardTypeFormat(type);
      setFormValues({
        ...formValues,
        type: formattedType,
      });
      setCardMaxLength(maxLength);
    },
    [formValues]
  );
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
      });
    },
    [formValues]
  );
  const handleFocus = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
      setCurrentFocus("expiry");
    } else if (e.target.name === "cvv") {
      setCurrentFocus("cvc");
    } else {
      setCurrentFocus(e.target.name);
    }
  }, []);
  const handleBlur = useCallback(() => setCurrentFocus(""), []);

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
    if (window.confirm(t("forms.licenseUpload.goBack.title") + "\n" + t("forms.licenseUpload.goBack.message"))) {
      dispatch(clearReduxFormState("licenseUploadForm"));
      handlePrevious();
    }
  }, [dispatch, handlePrevious, t]);

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    setSchemaErrors([]);
    try {
      const formValid = await schema.isValid(formValues);
      if (!frontImageFile) setDisplayNoFrontImageError(true);
      if (!backImageFile) setDisplayNoBackImageError(true);

      if (!backImageFile || !frontImageFile || !formValid) {
        if (!formValid) {
          await schema.validate(formValues, { abortEarly: false });
        }
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
      dispatch(setCreditCardFormData(formValues));
      handleSubmit();
    } catch (error: any) {
      const err = error as yup.ValidationError;
      const formErrors = yupFormatSchemaErrors(err);
      setSchemaErrors(formErrors);
    }
  }, [backImageFile, dispatch, formValues, frontImageFile, handleSubmit, schema]);

  return (
    <React.Fragment>
      <CardLayout>
        {/* Credit card form */}
        <div>
          <h1 className={cardTitleClassNames}>{t("forms.creditCard.title")}</h1>
          <span className={cardSubtitleClassNames}>{t("forms.creditCard.message")}</span>
          <div className="mt-4 grid grid-cols-1">
            <div>
              <DefaultCreditCard
                currentFocus={currentFocus}
                formData={formValues}
                handleCardIdentifier={handleCardIdentifier}
              />
            </div>
            <div className="mt-3">
              <DefaultCardDetailsForm
                formData={formValues}
                cardMaxLength={cardMaxLength}
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleFocus={handleFocus}
                schemaErrors={schemaErrors}
              />
            </div>
          </div>
        </div>
        {/* License Upload Form */}
        <div className="mt-5 pt-5">
          <h1 className={cardTitleClassNames}>{t("forms.licenseUpload.title")}</h1>
          <span className={cardSubtitleClassNames}>{t("forms.licenseUpload.message")}</span>
          <div className="mt-3 d-grid">
            <div>
              <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.frontImage.title")}</h2>
              <div>
                {displayNoFrontImageError && <Alert>{t("forms.licenseUpload.frontImage.notSelected")}</Alert>}

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
            <div className="mt-4">
              <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.backImage.title")}</h2>
              <div>
                {displayNoBackImageError && <Alert>{t("forms.licenseUpload.backImage.notSelected")}</Alert>}
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
        <div className="mt-4 flex">
          {isPrevPageAvailable && (
            <div className="pr-0">
              <Button variant="warning" size="lg" onClick={handleOpenModalConfirmation}>
                &#8592;
              </Button>
            </div>
          )}
          <div className={isPrevPageAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button variant="primary" size="lg" onClick={handleNextState}>
              {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
            </Button>
          </div>
        </div>
      </CardLayout>
    </React.Fragment>
  );
};

export default DefaultCreditCardAndLicenseUploadController;
