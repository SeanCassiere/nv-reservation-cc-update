import React, { useCallback, useState } from "react";
import { Card, Button, Col, Row, Modal, Accordion, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";

import { selectCreditCardForm, selectTranslations } from "../../redux/store";
import { setCreditCardFormData } from "../../redux/slices/forms";
import { YupErrorsFormatted, yupFormatSchemaErrors } from "../../utils/yupSchemaErrors";
import { creditCardTypeFormat } from "../../utils/creditCardTypeFormat";
import { setLicenseUploadFormData } from "../../redux/slices/forms";

import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import DefaultCreditCard from "../../components/DynamicCreditCard/DefaultCreditCard";
import DefaultCardDetailsForm from "../../components/DefaultCardDetailsForm/DefaultCardDetailsForm";
import useCreditCardSchema from "../../hooks/useCreditCardSchema";

interface IProps {
	handleSubmit: () => void;
	isNextAvailable: () => boolean;
	handlePrevious: () => void;
	isPrevPageAvailable: () => boolean;
}

const DefaultCreditCardAndLicenseUploadController = ({
	handleSubmit,
	isNextAvailable,
	handlePrevious,
	isPrevPageAvailable,
}: IProps) => {
	const dispatch = useDispatch();
	const t = useSelector(selectTranslations);
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
	const [key, setKey] = useState<string | undefined>("front");

	const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
	const [displayNoFrontImageError, setDisplayNoFrontImageError] = useState(false);

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
		handlePrevious();
	}, [handlePrevious]);

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
			if (process.env.NODE_ENV !== "production") console.log(formErrors);
			setSchemaErrors(formErrors);
		}
	}, [backImageFile, dispatch, formValues, frontImageFile, handleSubmit, schema]);

	return (
		<>
			<Card border='light'>
				<Card.Body>
					<Card.Title>{t.form.title}</Card.Title>
					<Card.Subtitle>{t.form.message}</Card.Subtitle>
					<div className='mt-4 d-grid'>
						<Row>
							<Col md={12}>
								<DefaultCreditCard
									currentFocus={currentFocus}
									formData={formValues}
									handleCardIdentifier={handleCardIdentifier}
								/>
							</Col>
						</Row>
						<Row className='mt-3'>
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
					<Modal.Header>{t.license_upload.go_back.title}</Modal.Header>
					<Modal.Body>{t.license_upload.go_back.message}</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={handleModalDenyReturn}>
							{t.license_upload.go_back.cancel}
						</Button>
						<Button variant='warning' onClick={handleModalAcceptReturn}>
							{t.license_upload.go_back.submit}
						</Button>
					</Modal.Footer>
				</Modal>
				{/* License Upload Form */}
				<Card.Body className='mt-4'>
					<Card.Title>{t.license_upload.title}</Card.Title>
					<Card.Subtitle>{t.license_upload.message}</Card.Subtitle>
					<div className='mt-3 d-grid'>
						<Row>
							<Col md={12}>
								<Accordion
									activeKey={key}
									onSelect={(k) => {
										if (k) setKey(k);
									}}
									className='border-light'
								>
									<Accordion.Item eventKey='front' className='border-light' style={{ background: "none" }}>
										<Accordion.Header className='border-light' style={{ padding: "0px !important" }}>
											{t.license_upload.front_image.title}
										</Accordion.Header>
										<Accordion.Body>
											{displayNoFrontImageError && (
												<Alert variant='light'>{t.license_upload.front_image.not_selected}</Alert>
											)}
											<DefaultImageDropzoneWithPreview
												dragDisplayText={t.license_upload.front_image.drag}
												selectButtonText={t.license_upload.front_image.select}
												clearButtonText={t.license_upload.front_image.clear}
												onSelectFile={selectFrontImage}
												onClearFile={clearFrontImage}
												acceptOnly={["image/jpeg", "image/jpg", "image/png"]}
											/>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey='back' className='border-light'>
										<Accordion.Header className='border-light'>{t.license_upload.back_image.title}</Accordion.Header>
										<Accordion.Body>
											{displayNoBackImageError && (
												<Alert variant='light'>{t.license_upload.back_image.not_selected}</Alert>
											)}
											<DefaultImageDropzoneWithPreview
												dragDisplayText={t.license_upload.back_image.drag}
												selectButtonText={t.license_upload.back_image.select}
												clearButtonText={t.license_upload.back_image.clear}
												onSelectFile={selectBackImage}
												onClearFile={clearBackImage}
												acceptOnly={["image/jpeg", "image/jpg", "image/png"]}
											/>
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</Col>
						</Row>
						{/* Navigation */}
						<Row className='mt-3'>
							{isPrevPageAvailable() && (
								<Col xs={2} className='pr-0'>
									<Button variant='warning' size='lg' style={{ width: "100%" }} onClick={handleOpenModalConfirmation}>
										&#8592;
									</Button>
								</Col>
							)}
							<Col xs={isPrevPageAvailable() ? 10 : 12} className={isPrevPageAvailable() ? "pl-2" : ""}>
								<Button variant='primary' size='lg' style={{ width: "100%" }} onClick={handleNextState}>
									{isNextAvailable() ? t.form.labels.next : t.form.labels.submit}
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
