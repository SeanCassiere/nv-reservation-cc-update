import React from "react";

import DefaultCreditCardController from "../CreditCardController/DefaultCreditCardController";

interface IProps {
	selectedController: string | null;
	handleNext: () => void;
	isNextPageAvailable: () => boolean;
}

const DisplayCurrentController = ({ selectedController, handleNext, isNextPageAvailable }: IProps) => {
	return (
		<>
			{selectedController === "Default/CreditCardForm" && (
				<DefaultCreditCardController handleSubmit={handleNext} isNextAvailable={isNextPageAvailable} />
			)}
			{selectedController === "Default/Positive" && (
				<div>
					<h5>positive</h5>
					<p>
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
						<button type='button' onClick={handleNext}>
							{isNextPageAvailable() ? "next" : "submit"}
						</button>
					</p>
				</div>
			)}
		</>
	);
};

export default DisplayCurrentController;
