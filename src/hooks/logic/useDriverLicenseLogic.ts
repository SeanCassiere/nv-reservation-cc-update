import React from "react";

import type { OnClearImageFn, OnSelectImageFn, PreviewImage } from "@/components/image-dropzone-with-preview";

import type { AppNavMode } from "@/hooks/logic/useAppNavContext";
import { useFormStore } from "@/hooks/stores/useFormStore";

type SaveLicenseImagesToStoreFn = () => boolean;

type UseDriverLicenseInitialData = {
  frontImageDataUrl?: string | null;
  frontImageName?: string | null;
  backImageDataUrl?: string | null;
  backImageName?: string | null;
};

export const useDriverLicenseLogic = (
  { frontImageDataUrl, frontImageName, backImageDataUrl, backImageName }: UseDriverLicenseInitialData,
  navMode: AppNavMode,
) => {
  const clearStoreFormStorage = useFormStore((s) => s.clearFormStateKey);
  const setDriversLicenseToStorage = useFormStore((s) => s.setDriversLicense);

  const [frontImageState, setFrontImageState] = React.useState<PreviewImage | null>(
    frontImageDataUrl && frontImageName ? { fileName: frontImageName, dataUrl: frontImageDataUrl } : null,
  );
  const [isFrontImageError, setIsFrontImageError] = React.useState(false);

  const [backImageState, setBackImageState] = React.useState<PreviewImage | null>(
    backImageDataUrl && backImageName ? { fileName: backImageName, dataUrl: backImageDataUrl } : null,
  );
  const [isBackImageError, setIsBackImageError] = React.useState(false);

  const selectFrontImage: OnSelectImageFn = React.useCallback((saveDataFromComponent) => {
    setIsFrontImageError(false);
    setFrontImageState(saveDataFromComponent);
  }, []);

  const clearFrontImage: OnClearImageFn = React.useCallback(
    (previewImageState) => {
      if (previewImageState && navMode === "navigate") {
        URL.revokeObjectURL(previewImageState.dataUrl);
      }
      setFrontImageState(null);
    },
    [navMode],
  );

  const selectBackImage: OnSelectImageFn = React.useCallback((saveDataFromComponent) => {
    setIsBackImageError(false);
    setBackImageState(saveDataFromComponent);
  }, []);

  const clearBackImage: OnClearImageFn = React.useCallback(
    (previewImageState) => {
      if (previewImageState && navMode === "navigate") {
        URL.revokeObjectURL(previewImageState.dataUrl);
      }
      setBackImageState(null);
    },
    [navMode],
  );

  const saveLicenseImagesToStore: SaveLicenseImagesToStoreFn = React.useCallback(() => {
    // locally tracking errors
    let hasFrontImageError = false;
    let hasBackImageError = false;

    if (!frontImageState) {
      setIsFrontImageError(true);
      hasFrontImageError = true;
    }

    if (!backImageState) {
      setIsBackImageError(true);
      hasBackImageError = true;
    }

    if (hasFrontImageError || hasBackImageError || !frontImageState || !backImageState) return false;

    setDriversLicenseToStorage({
      frontImageUrl: frontImageState.dataUrl,
      backImageUrl: backImageState.dataUrl,
      frontImageName: frontImageState.fileName,
      backImageName: backImageState.fileName,
    });
    return true;
  }, [frontImageState, backImageState, setDriversLicenseToStorage]);

  const clearLicenseImagesFromStore = React.useCallback(() => {
    clearStoreFormStorage("driversLicense");
  }, [clearStoreFormStorage]);

  return {
    isFrontImageError,
    isBackImageError,
    frontLicenseImage: frontImageState,
    backLicenseImage: backImageState,
    setFrontImage: selectFrontImage,
    setBackImage: selectBackImage,
    clearFrontImage,
    clearBackImage,
    saveLicenseImagesToStore,
    clearLicenseImagesFromStore,
  };
};
