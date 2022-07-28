import React from "react";
import { Card, Row, Col, Button, Modal, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import DefaultSignatureCanvas from "../../components/DefaultSignatureCanvas/DefaultSignatureCanvas";

import { clearReduxFormState, setRentalSignatureFormData } from "../../redux/slices/forms/slice";
import { selectConfigState } from "../../redux/store";
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
  const [signatureUrl, setSignatureUrl] = React.useState("");

  const [returnModalOpen, setReturnModalOpen] = React.useState(false);
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
    setReturnModalOpen(true);
  }, []);

  const handleModalAcceptReturn = React.useCallback(() => {
    dispatch(clearReduxFormState("rentalSignatureForm"));
    handlePrevious();
  }, [dispatch, handlePrevious]);

  const handleModalDenyReturn = React.useCallback(() => {
    setReturnModalOpen(false);
  }, []);

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
    <>
      <Modal show={returnModalOpen} onHide={handleModalDenyReturn} keyboard={true} centered>
        <Modal.Header>{t("forms.rentalSignature.goBack.title")}</Modal.Header>
        <Modal.Body>{t("forms.rentalSignature.goBack.message")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalDenyReturn}>
            {t("forms.rentalSignature.goBack.cancel")}
          </Button>
          <Button variant="warning" onClick={handleModalAcceptReturn}>
            {t("forms.rentalSignature.goBack.submit")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Card border="light">
        <Card.Body>
          <Card.Title>
            {t("forms.rentalSignature.title", {
              context: configState.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </Card.Title>
          <Card.Subtitle>
            {t("forms.rentalSignature.message", {
              context: configState.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT ? "agreement" : "reservation",
            })}
          </Card.Subtitle>
          <div className="mt-3 d-grid">
            {showRequiredMessage && <Alert variant="light">{t("forms.rentalSignature.signatureRequired")}</Alert>}
            <Row>
              <Col md={12}>
                <DefaultSignatureCanvas onSignature={handleSettingSignatureUrl} />
              </Col>
            </Row>
            <Row className="mt-3">
              {isPrevPageAvailable && (
                <Col xs={2} className="pr-0">
                  <Button variant="warning" size="lg" style={{ width: "100%" }} onClick={handleOpenModalConfirmation}>
                    &#8592;
                  </Button>
                </Col>
              )}
              <Col xs={isPrevPageAvailable ? 10 : 12} className={isPrevPageAvailable ? "pl-2" : ""}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ width: "100%" }}
                  disabled={signatureUrl === ""}
                  onClick={handleNextState}
                >
                  {isNextAvailable ? t("forms.navNext") : t("forms.navSubmit")}
                </Button>
              </Col>
            </Row>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default DefaultRentalSignatureController;
