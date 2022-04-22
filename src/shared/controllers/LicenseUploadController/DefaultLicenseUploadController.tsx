import React, { useCallback, useEffect, useState } from "react";
import { Card, Row, Col, Button, Modal, Accordion, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";
import { clearReduxFormState, setLicenseUploadFormData } from "../../redux/slices/forms/slice";
import { selectLicenseUploadForm } from "../../redux/store";
import { urlToBlob } from "../../utils/blobUtils";

interface IProps {
	handleSubmit: () => void;
	handlePrevious: () => void;
	isNextAvailable: boolean;
	isPrevPageAvailable: boolean;
}

const DefaultLicenseUploadController = ({
	handleSubmit,
	handlePrevious,
	isNextAvailable,
	isPrevPageAvailable,
}: IProps) => {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		data: { frontImageUrl, frontImageName, backImageName, backImageUrl },
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
	const handleNextState = useCallback(() => {
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
		handleSubmit();
	}, [backImageFile, dispatch, frontImageFile, handleSubmit]);

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
	return (
		<>
			<Modal show={returnModalOpen} onHide={handleModalDenyReturn} keyboard={true} centered>
				<Modal.Header>{t("license_upload.go_back.title")}</Modal.Header>
				<Modal.Body>{t("license_upload.go_back.message")}</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleModalDenyReturn}>
						{t("license_upload.go_back.cancel")}
					</Button>
					<Button variant='warning' onClick={handleModalAcceptReturn}>
						{t("license_upload.go_back.submit")}
					</Button>
				</Modal.Footer>
			</Modal>
			<Card border='light'>
				<Card.Body>
					<Card.Title>{t("license_upload.title")}</Card.Title>
					<Card.Subtitle>{t("license_upload.message")}</Card.Subtitle>
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
											{t("license_upload.front_image.title")}
										</Accordion.Header>
										<Accordion.Body>
											{displayNoFrontImageError && (
												<Alert variant='light'>{t("license_upload.front_image.not_selected")}</Alert>
											)}
											<DefaultImageDropzoneWithPreview
												dragDisplayText={t("license_upload.front_image.drag")}
												selectButtonText={t("license_upload.front_image.select")}
												clearButtonText={t("license_upload.front_image.clear")}
												onSelectFile={selectFrontImage}
												onClearFile={clearFrontImage}
												acceptOnly={["image/jpeg", "image/jpg", "image/png"]}
												initialPreview={frontImageUrl ? { fileName: frontImageName!, url: frontImageUrl } : null}
											/>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey='back' className='border-light'>
										<Accordion.Header className='border-light'>{t("license_upload.back_image.title")}</Accordion.Header>
										<Accordion.Body>
											{displayNoBackImageError && (
												<Alert variant='light'>{t("license_upload.back_image.not_selected")}</Alert>
											)}
											<DefaultImageDropzoneWithPreview
												dragDisplayText={t("license_upload.back_image.drag")}
												selectButtonText={t("license_upload.back_image.select")}
												clearButtonText={t("license_upload.back_image.clear")}
												onSelectFile={selectBackImage}
												onClearFile={clearBackImage}
												acceptOnly={["image/jpeg", "image/jpg", "image/png"]}
												initialPreview={backImageUrl ? { fileName: backImageName!, url: backImageUrl } : null}
											/>
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</Col>
						</Row>
						<Row className='mt-3'>
							{isPrevPageAvailable && (
								<Col xs={2} className='pr-0'>
									<Button variant='warning' size='lg' style={{ width: "100%" }} onClick={handleOpenModalConfirmation}>
										&#8592;
									</Button>
								</Col>
							)}
							<Col xs={isPrevPageAvailable ? 10 : 12} className={isPrevPageAvailable ? "pl-2" : ""}>
								<Button variant='primary' size='lg' style={{ width: "100%" }} onClick={handleNextState}>
									{isNextAvailable ? t("form.labels.next") : t("form.labels.submit")}
								</Button>
							</Col>
						</Row>
					</div>
				</Card.Body>
			</Card>
		</>
	);
};
export default DefaultLicenseUploadController;
