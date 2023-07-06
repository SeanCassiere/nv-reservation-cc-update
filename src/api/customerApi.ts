import { clientFetch } from "./clientV3";
import type { CreditCardStoreType } from "@/hooks/stores/useFormStore";

export async function postDriverLicenseImage(opts: {
  clientId: number;
  customerId: string;
  imageName: string;
  imageBase64: string;
  imageMimeType: string;
  side: string;
}) {
  const customerId = opts.customerId;
  const imageName = opts.imageName;
  const clientId = opts.clientId;
  const side = opts.side;
  const imageBase64 = opts.imageBase64;
  const imageMineType = opts.imageMimeType;

  return await clientFetch(`/Customers/${customerId}/Documents`, {
    method: "POST",
    body: JSON.stringify({
      clientId,
      blob: imageBase64,
      fileName: imageName,
      contentType: imageMineType,
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

  const expiryMonth = creditCard.monthYearExpiry.split("/")[0];
  const expiryYear = creditCard.monthYearExpiry.split("/")[1];

  return await clientFetch(`/Customers/${customerId}/CreditCards`, {
    method: "POST",
    body: JSON.stringify({
      creditCardType: creditCard.type,
      creditCardNumber: creditCard.number?.replaceAll(" ", "")?.trim(),
      creditCardExpiryMonth: parseInt(expiryMonth),
      creditCardExpiryYear: parseInt(`20${expiryYear}`),
      creditCardCVSNumber: creditCard.cvv?.trim(),
      nameOnCard: creditCard.name?.trim(),
      creditCardBillingZipCode: creditCard.billingZip?.trim(),
      gatewayMandateID: null,
      gatewayRedirectFlow: null,
      gatewayCustomerID: null,
    }),
  });
}
