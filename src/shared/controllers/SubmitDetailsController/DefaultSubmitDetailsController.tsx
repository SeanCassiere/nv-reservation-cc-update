import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import LoadingSubmission from "../../pages/LoadingSubmission/LoadingSubmission";
import { selectSubmissionState } from "../../redux/store";
import { submitFormThunk } from "../../redux/slices/forms/thunks";

const DefaultSubmitDetailsController = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { current_submission_message } = useSelector(selectSubmissionState);

  const { state } = useSelector(selectSubmissionState);

  useEffect(() => {
    if (state === "submitting_details_success") {
      return navigate("/success", { replace: true, state: { from: location } });
    }
    if (state === "submitting_details_error") {
      return navigate("/error", { replace: true, state: { from: location } });
    }
    dispatch(submitFormThunk() as any);
  }, [dispatch, navigate, location, state]);

  return <LoadingSubmission title={current_submission_message} />;
};

export default DefaultSubmitDetailsController;
