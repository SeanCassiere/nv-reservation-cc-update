import React from "react";

import type { OnClearImageFn } from "@/components/image-dropzone-with-preview";

import type { AppNavMode } from "@/hooks/logic/useAppNavContext";
import { useFormStore } from "@/hooks/stores/useFormStore";

import { urlToBlob } from "@/utils/blobUtils";

type SaveLicenseImagesToStoreFn = () => boolean;

type UseDriverLicenseInitialData = {
  frontImageDataUrl?: string | null;
  frontImageName?: string | null;
  backImageDataUrl?: string | null;
  backImageName?: string | null;
};

export const useDriverLicenseLogic = (
  { frontImageDataUrl, frontImageName, backImageDataUrl, backImageName }: UseDriverLicenseInitialData,
  navMode: AppNavMode
) => {
  const clearStoreFormStorage = useFormStore((s) => s.clearFormStateKey);
  const setDriversLicenseToStorage = useFormStore((s) => s.setDriversLicense);

  const [frontImageFile, setFrontImageFile] = React.useState<File | null>(null);
  const [displayNoFrontImageError, setDisplayNoFrontImageError] = React.useState(false);

  const [backImageFile, setBackImageFile] = React.useState<File | null>(null);
  const [displayNoBackImageError, setDisplayNoBackImageError] = React.useState(false);

  const selectFrontImage = React.useCallback(async (file: File) => {
    setDisplayNoFrontImageError(false);
    setFrontImageFile(file);
  }, []);

  const clearFrontImage: OnClearImageFn = React.useCallback(
    (previewImageState) => {
      if (previewImageState && navMode === "navigate") {
        URL.revokeObjectURL(previewImageState.url);
      }
      setFrontImageFile(null);
    },
    [navMode]
  );

  const selectBackImage = React.useCallback((file: File) => {
    setDisplayNoBackImageError(false);
    setBackImageFile(file);
  }, []);

  const clearBackImage: OnClearImageFn = React.useCallback(
    (previewImageState) => {
      if (previewImageState && navMode === "navigate") {
        URL.revokeObjectURL(previewImageState.url);
      }
      setBackImageFile(null);
    },
    [navMode]
  );

  const setFrontImageError = React.useCallback((value: boolean) => {
    setDisplayNoFrontImageError(value);
  }, []);

  const setBackImageError = React.useCallback((value: boolean) => {
    setDisplayNoBackImageError(value);
  }, []);

  const saveLicenseImagesToStore: SaveLicenseImagesToStoreFn = React.useCallback(() => {
    // locally tracking errors
    let hasFrontImageError = false;
    let hasBackImageError = false;

    if (!frontImageFile) {
      setDisplayNoFrontImageError(true);
      hasFrontImageError = true;
    }

    if (!backImageFile) {
      setDisplayNoBackImageError(true);
      hasBackImageError = true;
    }

    if (hasFrontImageError || hasBackImageError || !frontImageFile || !backImageFile) return false;

    setDriversLicenseToStorage({
      frontImageUrl: URL.createObjectURL(frontImageFile),
      backImageUrl: URL.createObjectURL(backImageFile),
      frontImageName: frontImageFile.name,
      backImageName: backImageFile.name,
    });
    return false;
  }, [frontImageFile, backImageFile, setDriversLicenseToStorage]);

  const clearLicenseImagesFromStore = React.useCallback(() => {
    clearStoreFormStorage("driversLicense");
  }, [clearStoreFormStorage]);

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
    saveLicenseImagesToStore,
    clearLicenseImagesFromStore,
  };
};
