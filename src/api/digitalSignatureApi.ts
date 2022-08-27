import { clientFetch } from "./clientV3";

import { urlBlobToBase64 } from "../utils/blobUtils";
import { APP_CONSTANTS } from "../utils/constants";

export async function postUploadRentalSignature(opts: {
  imageUrl: string;
  customerName: string;
  referenceType: string;
  referenceId: string;
}) {
  const imageBase64 = await urlBlobToBase64(opts.imageUrl);

  const date = new Date().toISOString().substring(0, 19).replace("T", " (").replaceAll(":", "-");
  const imageType = `.${imageBase64.split(";")[0].split(":")[1].split("/")[1]}`;
  const imageName = `${date}) ${opts.referenceType} Signature`;

  return await clientFetch("/DigitalSignature/UploadSignature", {
    method: "POST",
    body: JSON.stringify({
      agreementId: opts.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? opts.referenceId : 0,
      reservationId: opts.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION ? opts.referenceId : 0,
      imageName,
      base64String: imageBase64,
      imageType,
      isCheckIn: false,
      isDamageView: false,
      signatureDate: new Date().toISOString(),
      signatureImage: null,
      signatureName: opts.customerName,
    }),
  });
}
