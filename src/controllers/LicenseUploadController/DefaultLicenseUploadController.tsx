import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { clearReduxFormState, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import { selectLicenseUploadForm } from "../../redux/store";
import { useDriverLicenseLogic } from "../../hooks/useDriverLicenseLogic";

import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import Button from "../../components/Elements/Button";
import CardLayout from "../../layouts/Card";
import Alert from "../../components/Elements/Alert";

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

  // General component state
  const handleNextState = useCallback(() => {
    if (!frontLicenseImage) setFrontImageError(true);
    if (!backLicenseImage) setBackImageError(true);
    if (!frontLicenseImage || !backLicenseImage) return;

    dispatch(
      setLicenseUploadFormData({
        frontImageUrl: URL.createObjectURL(frontLicenseImage),
        backImageUrl: URL.createObjectURL(backLicenseImage),
        frontImageName: frontLicenseImage.name,
        backImageName: backLicenseImage.name,
      })
    );
    handleSubmit();
  }, [frontLicenseImage, setFrontImageError, backLicenseImage, setBackImageError, dispatch, handleSubmit]);

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

  return (
    <CardLayout title={t("forms.licenseUpload.title")} subtitle={t("forms.licenseUpload.message")}>
      <div className="mt-3 grid grid-cols-1 gap-4">
        <div>
          <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.frontImage.title")}</h2>
          <div>
            {noFrontImageError && (
              <Alert variant="danger" fullWidth>
                {t("forms.licenseUpload.frontImage.notSelected")}
              </Alert>
            )}

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
        <div className="mt-2">
          <hr />
        </div>
        <div className="mt-2">
          <h2 className="text-base text-gray-500 mb-2">{t("forms.licenseUpload.backImage.title")}</h2>
          <div>
            {noBackImageError && (
              <Alert variant="danger" fullWidth>
                {t("forms.licenseUpload.backImage.notSelected")}
              </Alert>
            )}
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
        <div className="mt-1 flex">
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
      </div>
    </CardLayout>
  );
};
export default DefaultLicenseUploadController;
