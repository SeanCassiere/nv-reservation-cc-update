import React, { memo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import Button from "../../components/Elements/Default/Button";
import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";

import { APP_CONSTANTS } from "../../utils/constants";

const CcControllerDefault = lazy(() => import("../CreditCardController/Default"));
const LicenseUplControllerDefault = lazy(() => import("../LicenseUploadController/Default"));

const CcAndLicenseUplControllerDefault = lazy(() => import("../CreditCardAndLicenseUploadController/Default"));

const RentalSignatureControllerDefault = lazy(() => import("../RentalSignatureController/Default"));
const RentalSummaryControllerDefault = lazy(() => import("../RentalSummaryController/Default"));

export type CommonControllerProps = {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextPageAvailable: boolean;
  isPrevPageAvailable: boolean;
};

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

  const controllerProps: CommonControllerProps = {
    handleSubmit: handleNext,
    isNextPageAvailable,
    isPrevPageAvailable,
    handlePrevious,
  };

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSubmission title={t("appStatusMessages.loading")} />}>
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_FORM && (
          <CcControllerDefault {...controllerProps} />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_LICENSE_UPLOAD_FORM && (
          <LicenseUplControllerDefault {...controllerProps} />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_CREDIT_CARD_LICENSE_UPLOAD_FORM && (
          <CcAndLicenseUplControllerDefault {...controllerProps} />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_RENTAL_SIGNATURE_FORM && (
          <RentalSignatureControllerDefault {...controllerProps} />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEFAULT_RENTAL_CHARGES_FORM && (
          <RentalSummaryControllerDefault {...controllerProps} />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEV_SCREEN_1 && (
          <DevScreen {...controllerProps} title={APP_CONSTANTS.VIEW_DEV_SCREEN_1} />
        )}
        {selectedController === APP_CONSTANTS.VIEW_DEV_SCREEN_2 && (
          <DevScreen {...controllerProps} title={APP_CONSTANTS.VIEW_DEV_SCREEN_2} />
        )}
      </Suspense>
    </React.Fragment>
  );
};

export default memo(DisplayCurrentController);

const DevScreen = memo((props: CommonControllerProps & { title: string }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h5>{props.title}</h5>
      <div className="flex gap-1">
        <Button
          type="button"
          color="primary"
          variant="muted"
          disabled={!props.isPrevPageAvailable}
          onClick={props.handlePrevious}
        >
          &#8592;
        </Button>
        <Button type="button" onClick={props.handleSubmit}>
          {props.isNextPageAvailable ? t("forms.navNext") : t("forms.navSubmit")}
        </Button>
      </div>
    </div>
  );
});
