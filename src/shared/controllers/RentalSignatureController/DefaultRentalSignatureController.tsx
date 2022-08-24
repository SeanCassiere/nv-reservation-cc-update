import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import DefaultSignatureCanvas from "../../components/DefaultSignatureCanvas/DefaultSignatureCanvas";
import Button from "../../components/Elements/Button";
import CardLayout from "../../layouts/Card";

import { clearReduxFormState, setRentalSignatureFormData } from "../../redux/slices/forms/slice";
import { selectConfigState, selectRentalSignatureForm } from "../../redux/store";
import { APP_CONSTANTS } from "../../utils/constants";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultRentalSignatureController = ({
  handleSubmit,
  handlePrevious,
  isNextAvailable,
  isPrevPageAvailable,
}: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const configState = useSelector(selectConfigState);
  const signatureFormState = useSelector(selectRentalSignatureForm);
  const [signatureUrl, setSignatureUrl] = React.useState("");

  const [showRequiredMessage, setShowRequiredMessage] = React.useState(false);

  const handleNextState = React.useCallback(() => {
    if (signatureUrl === "") {
      setShowRequiredMessage(true);
      return;
    }

    dispatch(setRentalSignatureFormData({ signatureUrl, isReadyToSubmit: true }));

    handleSubmit();
  }, [dispatch, handleSubmit, signatureUrl]);

  const handleOpenModalConfirmation = React.useCallback(() => {
    if (
      signatureUrl !== "" &&
      window.confirm(t("forms.rentalSignature.goBack.title") + "\n" + t("forms.rentalSignature.goBack.message"))
    ) {
      dispatch(clearReduxFormState("rentalSignatureForm"));
      handlePrevious();
    }

    if (signatureUrl === "") {
      handlePrevious();
    }
  }, [dispatch, handlePrevious, signatureUrl, t]);

  const handleSettingSignatureUrl = React.useCallback((url: string) => {
    if (url === "") {
      setSignatureUrl("");
    } else {
      setShowRequiredMessage(false);
      setSignatureUrl(url);
    }
  }, []);

  React.useEffect(() => {
    dispatch(setRentalSignatureFormData({ signatureUrl: "", isReadyToSubmit: false }));
  }, [dispatch]);

  return (
    <CardLayout
      title={t("forms.rentalSignature.title", {
        context: configState.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
      subtitle={t("forms.rentalSignature.message", {
        context: configState.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
      })}
    >
      <div className="mt-3 d-grid">
        {showRequiredMessage && <div>{t("forms.rentalSignature.signatureRequired")}</div>}

        <DefaultSignatureCanvas
          onSignature={handleSettingSignatureUrl}
          initialDataURL={
            signatureFormState.data.signatureUrl !== "" ? signatureFormState.data.signatureUrl : undefined
          }
        />
        <div className="mt-3 flex">
          {isPrevPageAvailable && (
            <div className="pr-0">
              <Button variant="warning" size="lg" onClick={handleOpenModalConfirmation}>
                &#8592;
              </Button>
            </div>
          )}
          <div className={isPrevPageAvailable ? "pl-2 flex-1" : "flex-1"}>
            <Button variant="primary" size="lg" disabled={signatureUrl === ""} onClick={handleNextState}>
              {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
            </Button>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

export default DefaultRentalSignatureController;
