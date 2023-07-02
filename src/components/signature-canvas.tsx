import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactSignatureCanvas from "react-signature-canvas";

import { Button as UIButton } from "@/components/ui/button";

interface IProps {
  onSignature?: (signatureUrl: string) => void;
  clearText?: string;
  saveText?: string;
  trimmed?: boolean;
  initialDataURL?: string;
}

const SignatureCanvas: React.FC<IProps> = ({
  onSignature = (url: string) => {
    console.log("Signature URL: ", url);
  },
  clearText = undefined,
  saveText = undefined,
  trimmed = false,
  initialDataURL = undefined,
}) => {
  const { t } = useTranslation();

  const [showPad, setShowPad] = React.useState(false);
  const signatureDivRef = React.useRef<HTMLDivElement>(null);
  const signaturePadRef = React.useRef<ReactSignatureCanvas>(null);

  const [isDisabled, setIsDisabled] = React.useState(false);
  const canvasHeight = signatureDivRef?.current?.getBoundingClientRect().height
    ? signatureDivRef?.current?.getBoundingClientRect().height - 10
    : undefined;

  const canvasWidth = signatureDivRef?.current?.getBoundingClientRect().width
    ? signatureDivRef?.current?.getBoundingClientRect().width - 10
    : undefined;

  const handleClear = React.useCallback(() => {
    onSignature("");

    signaturePadRef.current?.on();
    signaturePadRef.current?.clear();

    setIsDisabled(false);
  }, [onSignature]);

  const handleSave = React.useCallback(
    async (initUrl?: string) => {
      const signaturePad = signaturePadRef.current;

      if (!signaturePad) {
        return;
      }

      if (signaturePad.isEmpty()) {
        // eslint-disable-next-line no-alert
        // alert(`${t("rental_signature.error_no_signature")}`);
        return;
      } else {
        const mime = "image/png";
        const canvas = trimmed ? signaturePad.getTrimmedCanvas() : signaturePad.getCanvas();
        canvas.toBlob((blob) => {
          setIsDisabled(true);

          signaturePad.off();

          let currentUrl = initUrl ?? "";
          if (!initUrl) {
            if (!blob) return;

            const blobRaw = new Blob([blob], { type: mime });
            currentUrl = URL.createObjectURL(blobRaw);
          }

          onSignature(currentUrl);
        });
      }
    },
    [onSignature, trimmed]
  );

  const handleInitialUrl = React.useCallback(
    (url: string) => {
      setIsDisabled(true);

      signaturePadRef.current?.fromDataURL(url, {
        height: canvasHeight,
        width: canvasWidth,
        callback: (err) => {
          console.log("canvas-fromDataURL-callback", err);
        },
      });

      handleSave(url);

      signaturePadRef.current?.off();
      onSignature(url);
    },
    [canvasHeight, canvasWidth, handleSave, onSignature]
  );

  useEffect(() => {
    setShowPad(true);
    if (initialDataURL && initialDataURL !== "") {
      handleInitialUrl(initialDataURL);
    } else {
      signaturePadRef.current?.clear();
      signaturePadRef.current?.on();
    }
  }, [handleInitialUrl, initialDataURL, onSignature, signaturePadRef]);

  return (
    <React.Fragment>
      <div
        ref={signatureDivRef}
        className="flex items-center justify-center rounded-md border-4 border-slate-700 p-1"
        style={{ height: "430px" }}
      >
        {showPad && (
          <ReactSignatureCanvas
            ref={signaturePadRef}
            dotSize={4}
            clearOnResize={true}
            canvasProps={{
              height: canvasHeight,
              width: canvasWidth,
            }}
          />
        )}
      </div>
      <div className="mx-5 mt-2 flex gap-2">
        <UIButton variant="destructive" size="sm" style={{ width: "60%" }} onClick={handleClear}>
          {clearText ?? t("forms.rentalSignature.clearInput")}
        </UIButton>
        <UIButton
          size="sm"
          variant="secondary"
          style={{ width: "40%" }}
          onClick={() => handleSave()}
          disabled={isDisabled}
        >
          {saveText ?? t("forms.rentalSignature.saveInput")}
        </UIButton>
      </div>
    </React.Fragment>
  );
};

export default SignatureCanvas;
