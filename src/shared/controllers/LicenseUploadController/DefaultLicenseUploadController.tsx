import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { clearReduxFormState, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import { selectLicenseUploadForm } from "../../redux/store";
import { urlToBlob } from "../../utils/blobUtils";

import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import Button from "../../components/Elements/Button";
import CardLayout from "../../layouts/Card";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultLicenseUploadController: React.FC<IProps> = ({
  handleSubmit,
  handlePrevious,
  isNextAvailable,
  isPrevPageAvailable,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    data: { frontImageUrl, frontImageName, backImageName, backImageUrl },
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

  // General component state
  const handleNextState = useCallback(() => {
    if (!frontImageFile) {
      setDisplayNoFrontImageError(true);
      return;
    }
    if (!backImageFile) {
      setDisplayNoBackImageError(true);
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
  }, [backImageFile, dispatch, frontImageFile, handleSubmit]);

  const handleOpenModalConfirmation = useCallback(() => {
    if (window.confirm(t("forms.licenseUpload.goBack.title") + "\n" + t("forms.licenseUpload.goBack.message"))) {
      dispatch(clearReduxFormState("licenseUploadForm"));
      handlePrevious();
    }
  }, [dispatch, handlePrevious, t]);

  return (
    <CardLayout title={t("forms.licenseUpload.title")} subtitle={t("forms.licenseUpload.message")}>
      <div className="mt-3 grid grid-cols-1 gap-4">
        <div>
          <h2>{t("forms.licenseUpload.frontImage.title")}</h2>
          <div>
            {displayNoFrontImageError && <div>{t("forms.licenseUpload.frontImage.notSelected")}</div>}

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
        <div>
          <h2>{t("forms.licenseUpload.backImage.title")}</h2>
          <div>
            {displayNoBackImageError && <div>{t("forms.licenseUpload.backImage.notSelected")}</div>}
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
        <div className="mt-1 flex">
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
      </div>
    </CardLayout>
  );
};
export default DefaultLicenseUploadController;
