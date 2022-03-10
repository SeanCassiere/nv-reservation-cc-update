import { ConfigSliceState } from "../redux/slices/config/slice";

interface V3UploadProps {
	config: ConfigSliceState;
	side: "Front" | "Back";
	imageName: string;
	imageBase64: string;
}

export const v3UploadLicenseImage = (props: V3UploadProps) => {
	const { config, imageBase64, imageName } = props;
	const mimeType = imageBase64.split(";")[0].split(":")[1];
	return {
		clientId: config.clientId,
		blob: imageBase64,
		fileName: imageName,
		contentType: mimeType,
		docTypeId: 5,
		videoDetails: null,
		printDocWithAgreement: true,
		attachDocWithAgreement: true,
	};
};
