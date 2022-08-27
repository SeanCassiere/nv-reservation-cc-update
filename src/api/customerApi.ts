import { clientFetch } from "./clientV3";
import { urlBlobToBase64 } from "../utils/blobUtils";
import type { CreditCardStoreType } from "../hooks/stores/useFormStore";

export async function postDriverLicenseImage(opts: {
  clientId: number;
  customerId: string;
  imageUrl: string;
  imageName: string;
  side: string;
}) {
  const customerId = opts.customerId;
  const imageUrl = opts.imageUrl;
  const imageName = opts.imageName;
  const clientId = opts.clientId;
  const side = opts.side;

  const imageBase64 = await urlBlobToBase64(imageUrl);
  const mimeType = imageBase64.split(";")[0].split(":")[1];

  return await clientFetch(`/Customers/${customerId}/Documents`, {
    method: "POST",
    body: JSON.stringify({
      clientId,
      blob: imageBase64,
      fileName: imageName,
      contentType: mimeType,
      docTypeId: 5,
      videoDetails: null,
      imageSide: side,
      printDocWithAgreement: true,
      attachDocWithAgreement: true,
    }),
  });
}

export async function postCustomerCreditCard(opts: {
  customerId: string | number;
  creditCard: CreditCardStoreType["data"];
}) {
  const customerId = opts.customerId;
  const creditCard = opts.creditCard;

  return await clientFetch(`/Customers/${customerId}/CreditCards`, {
    method: "POST",
    body: JSON.stringify({
      creditCardType: creditCard.type,
      creditCardNumber: creditCard.number?.replaceAll(" ", "")?.trim(),
      creditCardExpiryMonth: parseInt(creditCard.monthExpiry),
      creditCardExpiryYear: parseInt(`20${creditCard.yearExpiry}`),
      creditCardCVSNumber: creditCard.cvv?.trim(),
      nameOnCard: creditCard.name?.trim(),
      creditCardBillingZipCode: creditCard.billingZip?.trim(),
      gatewayMandateID: null,
      gatewayRedirectFlow: null,
      gatewayCustomerID: null,
    }),
  });
}
