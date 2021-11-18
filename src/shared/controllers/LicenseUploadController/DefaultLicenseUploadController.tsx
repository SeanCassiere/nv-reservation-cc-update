import React, { useCallback, useState } from "react";
import { Card, Row, Col, Button, Modal, Accordion, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

import { selectTranslations } from "../../redux/store";
import DefaultImageDropzoneWithPreview from "../../components/DefaultImageDropzoneWithPreview/DefaultImageDropzoneWithPreview";

interface IProps {
	handleSubmit: () => void;
	isNextAvailable: () => boolean;
	handlePrevious: () => void;
	isPrevPageAvailable: () => boolean;
}

const DefaultLicenseUploadController = ({
	handleSubmit,
	handlePrevious,
	isNextAvailable,
	isPrevPageAvailable,
}: IProps) => {
	const t = useSelector(selectTranslations);
	const [key, setKey] = useState("front");

	const [frontImage, setFrontImage] = useState<File | null>(null);
	const [displayNoFrontImageError, setDisplayNoFrontImageError] = useState(false);
	const [backImage, setBackImage] = useState<File | null>(null);
	const [displayNoBackImageError, setDisplayNoBackImageError] = useState(false);

	const selectFrontImage = useCallback((file: File) => {
		setDisplayNoFrontImageError(false);
		setFrontImage(file);
		setTimeout(() => {
			setKey("back");
		}, 500);
	}, []);

	const selectBackImage = useCallback((file: File) => {
		setDisplayNoBackImageError(false);
		setBackImage(file);
	}, []);

	// General component state
	const [returnModalOpen, setReturnModalOpen] = useState(false);
	const handleNextState = useCallback(() => {
		if (!frontImage) {
			setKey("front");
			setDisplayNoFrontImageError(true);
			return;
		}
		if (!backImage) {
			setKey("back");
			setDisplayNoBackImageError(true);
			return;
		}

		handleSubmit();
	}, [backImage, frontImage, handleSubmit]);

	const handleOpenModalConfirmation = useCallback(() => {
		setReturnModalOpen(true);
	}, []);

	const handleModalAcceptReturn = useCallback(() => {
		handlePrevious();
	}, [handlePrevious]);

	const handleModalDenyReturn = useCallback(() => {
		setReturnModalOpen(false);
	}, []);
	return (
		<>
			<Modal show={returnModalOpen} onHide={handleModalDenyReturn} keyboard={true}>
				<Modal.Header>Are you sure?</Modal.Header>
				<Modal.Body>Going back will discard the added files.</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleModalDenyReturn}>
						Cancel
					</Button>
					<Button variant='warning' onClick={handleModalAcceptReturn}>
						I Understand
					</Button>
				</Modal.Footer>
			</Modal>
			<Card border='light'>
				<Card.Body>
					<Card.Title>Driver's License</Card.Title>
					<Card.Subtitle>Upload front and back images of your driver's license.</Card.Subtitle>
					<div className='mt-3 d-grid'>
						<Row>
							<Col md={12}>
								<Accordion
									// defaultActiveKey='front'
									activeKey={key}
									onSelect={(k) => {
										if (k) setKey(k);
									}}
									className='border-light'
								>
									<Accordion.Item eventKey='front' className='border-light' style={{ background: "none" }}>
										<Accordion.Header className='border-light' style={{ padding: "0px !important" }}>
											Front Image
										</Accordion.Header>
										<Accordion.Body>
											{displayNoFrontImageError && <Alert variant='light'>You must select the front image.</Alert>}
											<DefaultImageDropzoneWithPreview
												dragDisplayText='Drag and drop the front image here'
												selectButtonText='Select the front image'
												clearButtonText='Clear the front image'
												onSelectFile={selectFrontImage}
											/>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey='back' className='border-light'>
										<Accordion.Header className='border-light'>Back Image</Accordion.Header>
										<Accordion.Body>
											{displayNoBackImageError && <Alert variant='light'>You must select the back image.</Alert>}
											<DefaultImageDropzoneWithPreview
												dragDisplayText='Drag and drop the back image here'
												selectButtonText='Select the back image'
												clearButtonText='Clear the back image'
												onSelectFile={selectBackImage}
											/>
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</Col>
						</Row>
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
export default DefaultLicenseUploadController;
