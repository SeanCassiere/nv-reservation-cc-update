import React from "react";
import { urlToBlob } from "../../utils/blobUtils";

type UseDriverLicenseLogic = {
  frontImageDataUrl?: string | null;
  frontImageName?: string | null;
  backImageDataUrl?: string | null;
  backImageName?: string | null;
};

export const useDriverLicenseLogic = ({
  frontImageDataUrl,
  frontImageName,
  backImageDataUrl,
  backImageName,
}: UseDriverLicenseLogic) => {
  const [frontImageFile, setFrontImageFile] = React.useState<File | null>(null);
  const [displayNoFrontImageError, setDisplayNoFrontImageError] = React.useState(false);

  const [backImageFile, setBackImageFile] = React.useState<File | null>(null);
  const [displayNoBackImageError, setDisplayNoBackImageError] = React.useState(false);

  const selectFrontImage = React.useCallback(async (file: File) => {
    setDisplayNoFrontImageError(false);
    setFrontImageFile(file);
  }, []);

  const clearFrontImage = React.useCallback(() => {
    setFrontImageFile(null);
  }, []);

  const selectBackImage = React.useCallback((file: File) => {
    setDisplayNoBackImageError(false);
    setBackImageFile(file);
  }, []);

  const clearBackImage = React.useCallback(() => {
    setBackImageFile(null);
  }, []);

  const setFrontImageError = React.useCallback((value: boolean) => {
    setDisplayNoFrontImageError(value);
  }, []);

  const setBackImageError = React.useCallback((value: boolean) => {
    setDisplayNoBackImageError(value);
  }, []);

  // On init, if data urls are available, convert them to blobs -> file and then set them to the state
  React.useEffect(() => {
    if (frontImageDataUrl && frontImageName) {
      (async () => {
        const blob = await urlToBlob(frontImageDataUrl);
        const file = new File([blob], frontImageName);
        setFrontImageFile(file);
      })();
    }

    if (backImageDataUrl && backImageName) {
      (async () => {
        const blob = await urlToBlob(backImageDataUrl);
        const file = new File([blob], backImageName);
        setBackImageFile(file);
      })();
    }
  }, [backImageDataUrl, backImageName, frontImageDataUrl, frontImageName]);

  return {
    noFrontImageError: displayNoFrontImageError,
    noBackImageError: displayNoBackImageError,
    frontLicenseImage: frontImageFile,
    backLicenseImage: backImageFile,
    setFrontImage: selectFrontImage,
    setBackImage: selectBackImage,
    setFrontImageError,
    setBackImageError,
    clearFrontImage,
    clearBackImage,
  };
};
