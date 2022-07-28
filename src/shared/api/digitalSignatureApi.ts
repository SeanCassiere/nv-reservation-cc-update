import clientV3 from "./clientV3";

import { urlBlobToBase64 } from "../utils/blobUtils";
import { APP_CONSTANTS } from "../utils/constants";

export const uploadRentalDigitalSignatureFromUrl = async (
  imageUrl: string,
  additionalDriverId: number,
  customerName: string,
  referenceType: any,
  referenceId: any
) => {
  const imageBase64 = await urlBlobToBase64(imageUrl);

  const date = new Date().toISOString().substring(0, 19).replace("T", " (").replaceAll(":", "-");
  const imageType = `.${imageBase64.split(";")[0].split(":")[1].split("/")[1]}`;
  const imageName = `${date}) ${referenceType} Signature`;

  let body: any = {
    agreementId: referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? `${referenceId}` : 0,
    reservationId: referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION ? `${referenceId}` : 0,
    imageName,
    base64String: imageBase64,
    imageType,
    isCheckIn: false,
    isDamageView: false,
    signatureImage: null,
    signatureName: customerName,
  };

  if (additionalDriverId) {
    body = { additionalDriverId, ...body };
  }

  try {
    await clientV3.post(`/DigitalSignature/UploadSignature`, body);

    return true;
  } catch (error) {
    console.log("Error uploading rental digital signature", error);
    return false;
  }
};
