import React, { useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import Button from "../Elements/Button";

interface IProps {
  maxHeight?: number;
  maxWidth?: number;
  onSignature?: (signatureUrl: string) => void;
  clearText?: string;
  saveText?: string;
  trimmed?: boolean;
  initialDataURL?: string;
}

const DefaultSignatureCanvas: React.FC<IProps> = ({
  maxHeight = 400,
  maxWidth = 450,
  onSignature = (url: string) => {
    console.log("Signature URL: ", url);
  },
  clearText = undefined,
  saveText = undefined,
  trimmed = false,
  initialDataURL = undefined,
}) => {
  const { t } = useTranslation();

  const signatureDivRef = React.useRef<HTMLDivElement>(null);
  const signaturePadRef = React.useRef<SignatureCanvas>(null);

  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleClear = React.useCallback(() => {
    onSignature("");

    signaturePadRef.current?.on();
    signaturePadRef.current?.clear();

    setIsDisabled(false);
  }, [onSignature]);

  const handleSave = React.useCallback(async () => {
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

        if (!blob) return;

        const blobRaw = new Blob([blob], { type: mime });
        const url = URL.createObjectURL(blobRaw);
        onSignature(url);
      });
    }
  }, [onSignature, trimmed]);

  useEffect(() => {
    if (initialDataURL) {
      setIsDisabled(true);
      signaturePadRef.current?.fromDataURL(initialDataURL);
      signaturePadRef.current?.off();
      onSignature(initialDataURL);
    }
  }, [initialDataURL, onSignature, signaturePadRef]);

  return (
    <React.Fragment>
      <div ref={signatureDivRef} className="p-1 rounded-md border-4 border-indigo-900" style={{ maxHeight: "430px" }}>
        <SignatureCanvas
          ref={signaturePadRef}
          dotSize={4}
          canvasProps={{
            height: signatureDivRef?.current?.clientHeight ? signatureDivRef?.current?.clientHeight : undefined,
            width: signatureDivRef?.current?.clientWidth,
          }}
        />
      </div>
      <div className="mx-5 mt-2 flex gap-2">
        <Button color="danger" size="sm" style={{ width: "60%" }} onClick={handleClear}>
          {clearText ?? t("forms.rentalSignature.clearInput")}
        </Button>
        <Button color="primary" size="sm" style={{ width: "40%" }} onClick={handleSave} disabled={isDisabled}>
          {saveText ?? t("forms.rentalSignature.saveInput")}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default DefaultSignatureCanvas;
