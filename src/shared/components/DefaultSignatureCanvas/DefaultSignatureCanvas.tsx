import React, { useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "react-i18next";
import * as Responsive from "react-responsive";
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

  const signaturePadRef = React.useRef<SignatureCanvas>(null);

  const isPhone = Responsive.useMediaQuery({ query: "(max-width: 400px)" });

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
    }
  }, [initialDataURL, signaturePadRef]);

  return (
    <React.Fragment>
      <div
        style={{
          border: `4px solid ${isDisabled ? "#333333" : "#325d88"}`,
          borderRadius: 5,
          padding: "0.1rem",
        }}
      >
        <SignatureCanvas
          ref={signaturePadRef}
          dotSize={4}
          canvasProps={{ height: isPhone ? 360 : maxHeight, width: isPhone ? 310 : maxWidth }}
        />
      </div>
      <div className="mt-2 flex gap-2">
        <Button variant="danger" size="sm" style={{ width: "60%" }} onClick={handleClear}>
          {clearText ?? t("forms.rentalSignature.clearInput")}
        </Button>
        <Button variant="primary" size="sm" style={{ width: "40%" }} onClick={handleSave} disabled={isDisabled}>
          {saveText ?? t("forms.rentalSignature.saveInput")}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default DefaultSignatureCanvas;
