import { postCustomerCreditCard, postDriverLicenseImage } from "../customerApi";
import { postUploadRentalSignature } from "../digitalSignatureApi";

import type {
  CreditCardStoreType,
  DriversLicenseStoreType,
  RentalSignatureStoreType,
} from "@/hooks/stores/useFormStore";
import type { RentalStoreType } from "@/hooks/stores/useRuntimeStore";
import type { OneOffUploadAttachment } from "../emailsApi";
import { splitMimeTypeFromBase64String, urlBlobToBase64 } from "@/utils/blobUtils";

export async function postFormDataToApi(stores: {
  clientId: string | number;
  customerId: number;
  referenceId: string | number;
  referenceType: string;
  rental: RentalStoreType | null;
  creditCard: CreditCardStoreType;
  driversLicense: DriversLicenseStoreType;
  rentalSignature: RentalSignatureStoreType;
  attachmentOptions: {
    stopAttachingDriverLicenseFiles: boolean;
  };
}) {
  const oneOffAttachmentsToUpload: OneOffUploadAttachment[] = [];
  const customerId = stores.customerId;
  const clientId = stores.clientId;
  const referenceId = stores.referenceId;
  const referenceType = stores.referenceType;
  const attachmentOptions = stores.attachmentOptions;

  const rental = stores.rental;

  const creditCard = stores.creditCard;
  const driversLicense = stores.driversLicense;
  const rentalSignature = stores.rentalSignature;

  const promisesToRun = [];

  if (creditCard.isFilled) {
    promisesToRun.push(postCustomerCreditCard({ customerId, creditCard: creditCard.data }));
  }

  if (driversLicense.isFilled) {
    if (driversLicense.data.frontImageName && driversLicense.data.frontImageUrl) {
      const frontImageBase64 = await urlBlobToBase64(driversLicense.data.frontImageUrl);
      const frontImageMimeType = splitMimeTypeFromBase64String(frontImageBase64);
      promisesToRun.push(
        postDriverLicenseImage({
          clientId: Number(clientId),
          customerId: `${customerId}`,
          imageName: driversLicense.data.frontImageName,
          imageMimeType: frontImageMimeType,
          imageBase64: frontImageBase64,
          side: "Front",
        })
      );
      if (attachmentOptions.stopAttachingDriverLicenseFiles !== true) {
        oneOffAttachmentsToUpload.push({
          fileName: driversLicense.data.frontImageName,
          mimeType: frontImageMimeType,
          blob: frontImageBase64,
        });
      }
    }
    //
    if (driversLicense.data.backImageName && driversLicense.data.backImageUrl) {
      const backImageBase64 = await urlBlobToBase64(driversLicense.data.backImageUrl);
      const backImageMimeType = splitMimeTypeFromBase64String(backImageBase64);
      promisesToRun.push(
        postDriverLicenseImage({
          clientId: Number(clientId),
          customerId: `${customerId}`,
          imageName: driversLicense.data.backImageName,
          imageMimeType: backImageMimeType,
          imageBase64: backImageBase64,
          side: "Back",
        })
      );
      if (attachmentOptions.stopAttachingDriverLicenseFiles !== true) {
        oneOffAttachmentsToUpload.push({
          fileName: driversLicense.data.backImageName,
          mimeType: backImageMimeType,
          blob: backImageBase64,
        });
      }
    }
  }

  if (rentalSignature.isFilled && rental) {
    promisesToRun.push(
      postUploadRentalSignature({
        customerName: rental.driverName,
        imageUrl: rentalSignature.data.signatureUrl,
        referenceType,
        referenceId: `${referenceId}`,
        isCheckedIn: rental.isCheckIn,
      })
    );
  }

  await Promise.all(promisesToRun);

  return { oneOffAttachmentsToUpload };
}
