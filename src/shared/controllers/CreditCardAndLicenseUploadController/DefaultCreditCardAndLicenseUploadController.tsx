import React, { useCallback, useEffect, useState } from "react";
import { Card, Button, Col, Row, Modal, Accordion, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

import { selectCreditCardForm, selectLicenseUploadForm } from "../../redux/store";
import { clearReduxFormState, setCreditCardFormData, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import { creditCardTypeFormat } from "../../utils/creditCardTypeFormat";

import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import DefaultCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";
import useCreditCardSchema from "../../hooks/useCreditCardSchema";
import { urlToBlob } from "../../utils/blobUtils";

interface IProps {
  handleSubmit: () => void;
  handlePrevious: () => void;
  isNextAvailable: boolean;
  isPrevPageAvailable: boolean;
}

const DefaultCreditCardAndLicenseUploadController = ({
  handleSubmit,
  isNextAvailable,
  handlePrevious,
  isPrevPageAvailable,
}: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { data: initialFormData } = useSelector(selectCreditCardForm);

  const [formValues, setFormValues] = useState(initialFormData);
  const [schemaErrors, setSchemaErrors] = useState<YupErrorsFormatted>([]);
  const [cardMaxLength, setCardMaxLength] = useState(16);

  const [currentFocus, setCurrentFocus] = useState<string>("");

  const { schema } = useCreditCardSchema();

  // Form element handlers
  const handleCardIdentifier = useCallback(
    (type: string, maxLength: number) => {
      const formattedType = creditCardTypeFormat(type);
      setFormValues({
        ...formValues,
        type: formattedType,
      });
      setCardMaxLength(maxLength);
    },
    [formValues]
  );
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
      });
    },
    [formValues]
  );
  const handleFocus = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "monthExpiry" || e.target.name === "yearExpiry") {
      setCurrentFocus("expiry");
    } else if (e.target.name === "cvv") {
      setCurrentFocus("cvc");
    } else {
      setCurrentFocus(e.target.name);
    }
  }, []);
  const handleBlur = useCallback(() => setCurrentFocus(""), []);

  // license related handlers
  const {
    data: { frontImageName, frontImageUrl, backImageName, backImageUrl },
  } = useSelector(selectLicenseUploadForm);
  const [key, setKey] = useState<string | undefined>("front");

  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [displayNoFrontImageError, setDisplayNoFrontImageError] = useState(false);

  // if available in redux, setting the front image file
  useEffect(() => {
    if (frontImageUrl) {
      (async () => {
        const blob = await urlToBlob(frontImageUrl);
        const file = new File([blob], frontImageName!);
        setFrontImageFile(file);
      })();
    }
  }, [frontImageName, frontImageUrl]);

  const selectFrontImage = useCallback(async (file: File) => {
    setDisplayNoFrontImageError(false);
    setFrontImageFile(file);

    setTimeout(() => {
      setKey("back");
    }, 500);
  }, []);

  const clearFrontImage = useCallback(() => {
    setFrontImageFile(null);
  }, []);

  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [displayNoBackImageError, setDisplayNoBackImageError] = useState(false);

  // if available in redux, setting the back image file
  useEffect(() => {
    if (backImageUrl) {
      (async () => {
        const blob = await urlToBlob(backImageUrl);
        const file = new File([blob], backImageName!);
        setBackImageFile(file);
      })();
    }
  }, [backImageName, backImageUrl]);

  const selectBackImage = useCallback((file: File) => {
    setDisplayNoBackImageError(false);
    setBackImageFile(file);
    setTimeout(() => {
      setKey(undefined);
    }, 500);
  }, []);

  const clearBackImage = useCallback(() => {
    setBackImageFile(null);
  }, []);

  // General component state
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const handleOpenModalConfirmation = useCallback(() => {
    setReturnModalOpen(true);
  }, []);

  const handleModalAcceptReturn = useCallback(() => {
    dispatch(clearReduxFormState("licenseUploadForm"));
    handlePrevious();
  }, [dispatch, handlePrevious]);

  const handleModalDenyReturn = useCallback(() => {
    setReturnModalOpen(false);
  }, []);

  // validate the form data against the schema
  const handleNextState = useCallback(async () => {
    setSchemaErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });
      if (!frontImageFile) {
        setKey("front");
        setDisplayNoFrontImageError(true);
        return;
      }
      if (!backImageFile) {
        setKey("back");
        setDisplayNoBackImageError(true);
        return;
      }
      dispatch(
        setLicenseUploadFormData({
          frontImageUrl: URL.createObjectURL(frontImageFile),
          backImageUrl: URL.createObjectURL(backImageFile),
          frontImageName: frontImageFile.name,
          backImageName: backImageFile.name,
        })
      );
      dispatch(setCreditCardFormData(formValues));
      handleSubmit();
    } catch (error: any) {
      const err = error as yup.ValidationError;
      const formErrors = yupFormatSchemaErrors(err);
      setSchemaErrors(formErrors);
    }
  }, [backImageFile, dispatch, formValues, frontImageFile, handleSubmit, schema]);

  return (
    <>
      <Card border="light">
        <Card.Body>
          <Card.Title>{t("forms.creditCard.title")}</Card.Title>
          <Card.Subtitle>{t("forms.creditCard.message")}</Card.Subtitle>
          <div className="mt-4 d-grid">
            <Row>
              <Col md={12}>
                <DefaultCreditCard
                  currentFocus={currentFocus}
                  formData={formValues}
                  handleCardIdentifier={handleCardIdentifier}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <DefaultCardDetailsForm
                  formData={formValues}
                  cardMaxLength={cardMaxLength}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  handleFocus={handleFocus}
                  schemaErrors={schemaErrors}
                />
              </Col>
            </Row>
          </div>
        </Card.Body>
        {/* License Upload Modal */}
        <Modal show={returnModalOpen} onHide={handleModalDenyReturn} keyboard={true} centered>
          <Modal.Header>{t("forms.licenseUpload.goBack.title")}</Modal.Header>
          <Modal.Body>{t("forms.licenseUpload.goBack.message")}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalDenyReturn}>
              {t("forms.licenseUpload.goBack.cancel")}
            </Button>
            <Button variant="warning" onClick={handleModalAcceptReturn}>
              {t("forms.licenseUpload.goBack.submit")}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* License Upload Form */}
        <Card.Body className="mt-4">
          <Card.Title>{t("forms.licenseUpload.title")}</Card.Title>
          <Card.Subtitle>{t("forms.licenseUpload.message")}</Card.Subtitle>
          <div className="mt-3 d-grid">
            <Row>
              <Col md={12}>
                <Accordion
                  activeKey={key}
                  onSelect={(k) => {
                    if (k) setKey(k as string);
                  }}
                  className="border-light"
                >
                  <Accordion.Item eventKey="front" className="border-light" style={{ background: "none" }}>
                    <Accordion.Header className="border-light" style={{ padding: "0px !important" }}>
                      {t("forms.licenseUpload.frontImage.title")}
                    </Accordion.Header>
                    <Accordion.Body>
                      {displayNoFrontImageError && (
                        <Alert variant="light">{t("forms.licenseUpload.frontImage.notSelected")}</Alert>
                      )}
                      <DefaultImageDropzoneWithPreview
                        dragDisplayText={t("forms.licenseUpload.frontImage.drag")}
                        selectButtonText={t("forms.licenseUpload.frontImage.select")}
                        clearButtonText={t("forms.licenseUpload.frontImage.clear")}
                        onSelectFile={selectFrontImage}
                        onClearFile={clearFrontImage}
                        acceptOnly={{
                          "image/jpeg": [".jpeg"],
                          "image/jpg": [".jpg"],
                          "image/png": [".png"],
                        }}
                        initialPreview={frontImageUrl ? { fileName: frontImageName!, url: frontImageUrl } : null}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="back" className="border-light">
                    <Accordion.Header className="border-light">
                      {t("forms.licenseUpload.backImage.title")}
                    </Accordion.Header>
                    <Accordion.Body>
                      {displayNoBackImageError && (
                        <Alert variant="light">{t("forms.licenseUpload.backImage.notSelected")}</Alert>
                      )}
                      <DefaultImageDropzoneWithPreview
                        dragDisplayText={t("forms.licenseUpload.backImage.drag")}
                        selectButtonText={t("forms.licenseUpload.backImage.select")}
                        clearButtonText={t("forms.licenseUpload.backImage.clear")}
                        onSelectFile={selectBackImage}
                        onClearFile={clearBackImage}
                        acceptOnly={{
                          "image/jpeg": [".jpeg"],
                          "image/jpg": [".jpg"],
                          "image/png": [".png"],
                        }}
                        initialPreview={backImageUrl ? { fileName: backImageName!, url: backImageUrl } : null}
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
            {/* Navigation */}
            <Row className="mt-3">
              {isPrevPageAvailable && (
                <Col xs={2} className="pr-0">
                  <Button variant="warning" size="lg" style={{ width: "100%" }} onClick={handleOpenModalConfirmation}>
                    &#8592;
                  </Button>
                </Col>
              )}
              <Col xs={isPrevPageAvailable ? 10 : 12} className={isPrevPageAvailable ? "pl-2" : ""}>
                <Button variant="primary" size="lg" style={{ width: "100%" }} onClick={handleNextState}>
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

export default DefaultCreditCardAndLicenseUploadController;
