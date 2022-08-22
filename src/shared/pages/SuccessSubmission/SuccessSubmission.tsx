import React from "react";
import { useSelector } from "react-redux";

import SubmissionSuccessDefaultLayout from "../../layouts/SubmissionSuccess/Default";
import { selectConfigState } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";

const SuccessSubmissionPage: React.FC = () => {
  const appConfig = useSelector(selectConfigState);

  if (appConfig.successSubmissionScreen === APP_CONSTANTS.SUCCESS_SCREEN_TEST) {
    return <TestSubmissionLayout />;
  }

  if (appConfig.successSubmissionScreen === APP_CONSTANTS.SUCCESS_SCREEN_DEFAULT) {
    return <SubmissionSuccessDefaultLayout />;
  }

  return <SubmissionSuccessDefaultLayout />;
};

export default SuccessSubmissionPage;

const TestSubmissionLayout = () => {
  return (
    <div>
      <h2>Test Success Submission</h2>
      <p>submission successful</p>
    </div>
  );
};
