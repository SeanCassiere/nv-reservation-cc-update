import React, { memo, Suspense, lazy } from "react";

import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";

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
	return (
		<Suspense fallback={<LoadingSubmission title='Loading' />}>
			{selectedController === "Default/CreditCardForm" && (
				<DefaultCreditCardController
					handleSubmit={handleNext}
					isNextAvailable={isNextPageAvailable}
					handlePrevious={handlePrevious}
					isPrevPageAvailable={isPrevPageAvailable}
				/>
			)}
			{selectedController === "Default/LicenseUploadForm" && (
				<DefaultLicenseUploadController
					handleSubmit={handleNext}
					isNextAvailable={isNextPageAvailable}
					handlePrevious={handlePrevious}
					isPrevPageAvailable={isPrevPageAvailable}
				/>
			)}
			{selectedController === "Default/CreditCardAndLicenseUploadController" ||
			selectedController === "Default/CreditCardAndLicenseUploadForm" ? (
				<DefaultCreditCardAndLicenseUploadController
					handleSubmit={handleNext}
					isNextAvailable={isNextPageAvailable}
					handlePrevious={handlePrevious}
					isPrevPageAvailable={isPrevPageAvailable}
				/>
			) : null}
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
							{isNextPageAvailable ? "next" : "submit"}
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
							{isNextPageAvailable ? "next" : "submit"}
						</button>
					</p>
				</div>
			)}
		</Suspense>
	);
};

export default memo(DisplayCurrentController);
