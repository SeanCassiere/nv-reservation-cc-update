import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";

import DefaultCreditCardController from "../CreditCardController/DefaultCreditCardController";

export const allAvailable = ["Default/CreditCardForm", "Default/Negative", "Default/Positive"];
const flow = ["Default/CreditCardForm"];

const ApplicationController = () => {
	const navigate = useNavigate();

	const [remainingFlowControllers, setRemainingFlowControllers] = useState<string[]>([]);
	const [currentController, setCurrentController] = useState<string | null>(null);

	const isNextPageAvailable = useCallback(() => remainingFlowControllers.length > 0, [remainingFlowControllers]);

	const handleSubmit = useCallback(() => {
		const nextPage = remainingFlowControllers[0];

		let remainingElements = remainingFlowControllers.filter((elem) => elem !== currentController);
		remainingElements = remainingElements.filter((elem) => elem !== nextPage);

		setRemainingFlowControllers(remainingElements);
		setCurrentController(nextPage);

		if (remainingFlowControllers.length === 0) {
			// navigate to a protected page with a submission controller
			return navigate("/submit-details");
		}
	}, [navigate, currentController, remainingFlowControllers]);

	useEffect(() => {
		const startingController = flow[0];
		// Removing the starting controller since it will automatically be shown
		const startingControllers = flow.filter((elem) => elem !== startingController);

		setRemainingFlowControllers(startingControllers);
		setCurrentController(startingController);
	}, []);

	return (
		<>
			{currentController === "Default/CreditCardForm" && (
				<DefaultCreditCardController handleSubmit={handleSubmit} isNextAvailable={isNextPageAvailable} />
			)}
			{currentController === "Default/Positive" && (
				<div>
					<h5>positive</h5>
					<p>
						<button type='button' onClick={handleSubmit}>
							{isNextPageAvailable() ? "next" : "submit"}
						</button>
					</p>
				</div>
			)}
			{currentController === "Default/Negative" && (
				<div>
					<h5>negative</h5>
					<p>
						<button type='button' onClick={handleSubmit}>
							{isNextPageAvailable() ? "next" : "submit"}
						</button>
					</p>
				</div>
			)}
		</>
	);
};

export default ApplicationController;
