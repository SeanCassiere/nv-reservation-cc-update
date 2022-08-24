import clientV3 from "./clientV3";

import { urlBlobToBase64 } from "../utils/blobUtils";
import { APP_CONSTANTS } from "../utils/constants";

export const uploadRentalDigitalSignatureFromUrl = async (opts: {
  imageUrl: string;
  additionalDriverId: number;
  customerName: string;
  referenceType: any;
  referenceId: any;
}) => {
  const imageBase64 = await urlBlobToBase64(opts.imageUrl);

  const date = new Date().toISOString().substring(0, 19).replace("T", " (").replaceAll(":", "-");
  const imageType = `.${imageBase64.split(";")[0].split(":")[1].split("/")[1]}`;
  const imageName = `${date}) ${opts.referenceType} Signature`;

  let body: any = {
    agreementId: opts.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? `${opts.referenceId}` : 0,
    reservationId: opts.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION ? `${opts.referenceId}` : 0,
    imageName,
    base64String: imageBase64,
    imageType,
    isCheckIn: false,
    isDamageView: false,
    signatureDate: new Date().toISOString(),
    signatureImage: null,
    signatureName: opts.customerName,
  };

  // disabled since we are not using this anymore
  // if (opts.additionalDriverId) {
  //   body = { additionalDriverId: opts.additionalDriverId, ...body };
  // }

  try {
    await clientV3.post(`/DigitalSignature/UploadSignature`, body);

    return true;
  } catch (error) {
    console.log("Error uploading rental digital signature", error);
    return false;
  }
};
