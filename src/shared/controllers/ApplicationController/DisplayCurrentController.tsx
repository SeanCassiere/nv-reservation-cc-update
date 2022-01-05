import React, { memo } from "react";

import DefaultCreditCardController from "../CreditCardController/DefaultCreditCardController";
import DefaultLicenseUploadController from "../LicenseUploadController/DefaultLicenseUploadController";
import DefaulCreditCardAndLicenseUploadController from "../CreditCardAndLicenseUploadController/DefaultCreditCardAndLicenseUploadController";

interface IProps {
	selectedController: string | null;
	handleNext: () => void;
	isNextPageAvailable: () => boolean;
	handlePrevious: () => void;
	isPrevPageAvailable: () => boolean;
}

const DisplayCurrentController = ({
	selectedController,
	handleNext,
	isNextPageAvailable,
	handlePrevious,
	isPrevPageAvailable,
}: IProps) => {
	return (
		<>
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
			{selectedController === "Default/CreditCardAndLicenseUploadController" && (
				<DefaulCreditCardAndLicenseUploadController
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
						{isPrevPageAvailable() && (
							<button type='button' onClick={handlePrevious}>
								&#8592;
							</button>
						)}
						<button type='button' onClick={handleNext}>
							{isNextPageAvailable() ? "next" : "submit"}
						</button>
					</p>
				</div>
			)}
			{selectedController === "Default/Negative" && (
				<div>
					<h5>negative</h5>
					<p>
						{isPrevPageAvailable() && (
							<button type='button' onClick={handlePrevious}>
								&#8592;
							</button>
						)}
						<button type='button' onClick={handleNext}>
							{isNextPageAvailable() ? "next" : "submit"}
						</button>
					</p>
				</div>
			)}
		</>
	);
};

export default memo(DisplayCurrentController);
