import React, { memo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";
import { APP_CONSTANTS } from "../../utils/constants";

const DefaultCreditCardController = lazy(
	() =>
		import(/* webpackChunkName: 'DefaultCreditCardController' */ "../CreditCardController/DefaultCreditCardController")
);
const DefaultLicenseUploadController = lazy(
	() =>
		import(
			/* webpackChunkName: 'DefaultLicenseUploadController' */ "../LicenseUploadController/DefaultLicenseUploadController"
		)
);
const DefaultCreditCardAndLicenseUploadController = lazy(
	() =>
		import(
			/* webpackChunkName: 'DefaultCreditCardAndLicenseUploadController' */ "../CreditCardAndLicenseUploadController/DefaultCreditCardAndLicenseUploadController"
		)
);

const DefaultRentalSignatureController = lazy(
	() =>
		import(
			/* webpackChunkName: 'DefaultRentalSignatureController' */ "../RentalSignatureController/DefaultRentalSignatureController"
		)
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
							<button type='button' onClick={handlePrevious}>
								&#8592;
							</button>
						)}
						<button type='button' onClick={handleNext}>
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
							<button type='button' onClick={handlePrevious}>
								&#8592;
							</button>
						)}
						<button type='button' onClick={handleNext}>
							{isNextPageAvailable ? t("forms.navNext") : t("forms.navSubmit")}
						</button>
					</p>
				</div>
			)}
		</Suspense>
	);
};

export default memo(DisplayCurrentController);
