import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCreditCardForm } from "../../redux/store";

const DefaultSubmitDetailsController = () => {
	const [isSubmitting, setIsSubmitting] = useState(true);
	const creditCardForm = useSelector(selectCreditCardForm);

	useEffect(() => {
		if (creditCardForm.isReadyToSubmit) {
			console.log("submitted ccForm", creditCardForm.data);
			setIsSubmitting(false);
		}
	}, [creditCardForm]);
	return <div>{isSubmitting ? "Submitting..." : "Submit"}</div>;
};

export default DefaultSubmitDetailsController;
