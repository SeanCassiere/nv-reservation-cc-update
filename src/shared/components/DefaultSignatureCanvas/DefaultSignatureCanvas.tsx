import React from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface IProps {
	minHeight?: number;
	onSignature?: (signatureUrl: string) => void;
	clearText?: string;
	saveText?: string;
}

const DefaultSignatureCanvas = ({
	minHeight = 300,
	onSignature = (url: string) => {
		console.log("Signature URL: ", url);
	},
	clearText = undefined,
	saveText = undefined,
}: IProps) => {
	const { t } = useTranslation();
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
			signaturePad.getTrimmedCanvas().toBlob((blob) => {
				setIsDisabled(true);

				signaturePad.off();

				if (!blob) return;

				const blobRaw = new Blob([blob], { type: mime });
				const url = URL.createObjectURL(blobRaw);
				onSignature(url);
			});
		}
	}, [onSignature]);

	return (
		<>
			<div style={{ border: `4px solid ${isDisabled ? "#333333" : "#325d88"}`, borderRadius: 5, padding: "0.1rem" }}>
				<SignatureCanvas ref={signaturePadRef} dotSize={4} canvasProps={{ height: minHeight, width: "auto" }} />
			</div>
			<div className='mt-2 d-flex justify-content-center gap-2'>
				<Button variant='danger' style={{ width: "60%" }} onClick={handleClear} disabled={!isDisabled}>
					{clearText ?? t("rental_signature.clear_input")}
				</Button>
				<Button variant='primary' style={{ width: "30%" }} onClick={handleSave} disabled={isDisabled}>
					{saveText ?? t("rental_signature.save_input")}
				</Button>
			</div>
		</>
	);
};

export default DefaultSignatureCanvas;
