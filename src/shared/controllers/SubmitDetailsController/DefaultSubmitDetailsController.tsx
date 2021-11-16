import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";
import { selectSubmissionState, selectTranslations } from "../../redux/store";
import { submitFormThunk } from "../../redux/thunks/formsThunks";

const DefaultSubmitDetailsController = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const t = useSelector(selectTranslations);

	const { state } = useSelector(selectSubmissionState);

	useEffect(() => {
		dispatch(submitFormThunk());
	}, [dispatch]);

	if (state === "submitting_details_success") {
		navigate("/success", { replace: true });
	}

	if (state === "submitting_details_error") {
		navigate("/error", { replace: true });
	}
	return <LoadingSubmission title={t.form.submitting_msg} />;
};

export default DefaultSubmitDetailsController;
