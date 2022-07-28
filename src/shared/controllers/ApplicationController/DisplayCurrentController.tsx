import React, { memo, Suspense } from "react";
import { useTranslation } from "react-i18next";

import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";
import { APP_CONSTANTS } from "../../utils/constants";

// import DefaultRentalSignatureController from "../RentalSignatureController/DefaultRentalSignatureController";
// import DefaultCreditCardController from "../CreditCardController/DefaultCreditCardController";
// import DefaultLicenseUploadController from "../LicenseUploadController/DefaultLicenseUploadController";
// import DefaultCreditCardAndLicenseUploadController from "../CreditCardAndLicenseUploadController/DefaultCreditCardAndLicenseUploadController";

const DefaultRentalSignatureController = React.lazy(
  () => import("../RentalSignatureController/DefaultRentalSignatureController")
);
const DefaultCreditCardController = React.lazy(() => import("../CreditCardController/DefaultCreditCardController"));
const DefaultLicenseUploadController = React.lazy(
  () => import("../LicenseUploadController/DefaultLicenseUploadController")
);
const DefaultCreditCardAndLicenseUploadController = React.lazy(
  () => import("../CreditCardAndLicenseUploadController/DefaultCreditCardAndLicenseUploadController")
);

interface IProps {
  selectedController: string | null;
  handleNext: () => void;
  handlePrevious: () => void;
  isNextPageAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DisplayCurrentController = ({
  selectedController,
  handleNext,
  isNextPageAvailable,
  handlePrevious,
  isPrevPageAvailable,
}: IProps) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_FORM && (
          <DefaultCreditCardController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_LICENSE_UPLOAD_FORM && (
          <DefaultLicenseUploadController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_CONTROLLER ||
        selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM ? (
          <DefaultCreditCardAndLicenseUploadController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        ) : null}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_RENTAL_SIGNATURE_FORM && (
          <DefaultRentalSignatureController
            handleSubmit={handleNext}
            isNextAvailable={isNextPageAvailable}
            handlePrevious={handlePrevious}
            isPrevPageAvailable={isPrevPageAvailable}
          />
        )}
        {selectedController === "Default/Positive" && (
          <div>
            <h5>positive</h5>
            <p>
              {isPrevPageAvailable && (
                <button type="button" onClick={handlePrevious}>
                  &#8592;
                </button>
              )}
              <button type="button" onClick={handleNext}>
                {isNextPageAvailable ? t("forms.navNext") : t("forms.navSubmit")}
              </button>
            </p>
          </div>
        )}
        {selectedController === "Default/Negative" && (
          <div>
            <h5>negative</h5>
            <p>
              {isPrevPageAvailable && (
                <button type="button" onClick={handlePrevious}>
                  &#8592;
                </button>
              )}
              <button type="button" onClick={handleNext}>
                {isNextPageAvailable ? t("forms.navNext") : t("forms.navSubmit")}
              </button>
            </p>
          </div>
        )}
      </Suspense>
    </React.Fragment>
  );
};

export default memo(DisplayCurrentController);
