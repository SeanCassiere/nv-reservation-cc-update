import clientV3 from "./clientV3";
import { ICreditCardFormData } from "../redux/slices/forms/slice";
import { urlBlobToBase64 } from "../utils/blobUtils";

export const insertCreditCardForCustomer = async (
  customerId: string,
  formBody: ICreditCardFormData
): Promise<boolean> => {
  try {
    await clientV3.post(`/Customers/${customerId}/CreditCards`, {
      creditCardType: formBody.type,
      creditCardNumber: formBody.number?.replaceAll(" ", "")?.trim(),
      creditCardExpiryMonth: parseInt(formBody.monthExpiry),
      creditCardExpiryYear: parseInt(`20${formBody.yearExpiry}`),
      creditCardCVSNumber: formBody.cvv?.trim(),
      nameOnCard: formBody.name?.trim(),
      creditCardBillingZipCode: formBody.billingZip?.trim(),
      gatewayMandateID: null,
      gatewayRedirectFlow: null,
      gatewayCustomerID: null,
    });

    return true;
  } catch (error) {
    console.error("Error inserting credit card for customer", error);
    return false;
  }
};

export const uploadDriverLicenseImageForCustomer = async (
  customerId: string,
  clientId: any,
  imageUrl: string,
  imageName: string
): Promise<boolean> => {
  const imageBase64 = await urlBlobToBase64(imageUrl);
  const mimeType = imageBase64.split(";")[0].split(":")[1];

  try {
    await clientV3.post(`/Customers/${customerId}/Documents`, {
      clientId: clientId,
      blob: imageBase64,
      fileName: imageName,
      contentType: mimeType,
      docTypeId: 5,
      videoDetails: null,
      printDocWithAgreement: true,
      attachDocWithAgreement: true,
    });

    return true;
  } catch (error) {
    console.error(`Error uploading driver license image for customer (imageName: ${imageName})`, error);
    return false;
  }
};
