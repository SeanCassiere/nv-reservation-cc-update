import { postCustomerCreditCard, postDriverLicenseImage } from "../customerApi";
import { postUploadRentalSignature } from "../digitalSignatureApi";

import type {
  CreditCardStoreType,
  DriversLicenseStoreType,
  RentalSignatureStoreType,
} from "../../hooks/stores/useFormStore";
import type { RentalStoreType } from "../../hooks/stores/useRuntimeStore";

export async function postFormDataToApi(stores: {
  clientId: string | number;
  customerId: number;
  referenceId: string | number;
  referenceType: string;
  rental: RentalStoreType | null;
  creditCard: CreditCardStoreType;
  driversLicense: DriversLicenseStoreType;
  rentalSignature: RentalSignatureStoreType;
}) {
  const customerId = stores.customerId;
  const clientId = stores.clientId;
  const referenceId = stores.referenceId;
  const referenceType = stores.referenceType;

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
      promisesToRun.push(
        postDriverLicenseImage({
          clientId: Number(clientId),
          customerId: `${customerId}`,
          imageUrl: driversLicense.data.frontImageUrl,
          imageName: driversLicense.data.frontImageName,
          side: "Front",
        })
      );
    }
    if (driversLicense.data.backImageName && driversLicense.data.backImageUrl) {
      promisesToRun.push(
        postDriverLicenseImage({
          clientId: Number(clientId),
          customerId: `${customerId}`,
          imageUrl: driversLicense.data.backImageUrl,
          imageName: driversLicense.data.backImageName,
          side: "Back",
        })
      );
    }
  }

  if (rentalSignature.isFilled && rental) {
    promisesToRun.push(
      postUploadRentalSignature({
        customerName: rental.driverName,
        imageUrl: rentalSignature.data.signatureUrl,
        referenceType,
        referenceId: `${referenceId}`,
      })
    );
  }

  return await Promise.all(promisesToRun);
}
