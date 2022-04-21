import React from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
	const { t } = useTranslation();
	const configState = useSelector(selectConfigState);

	const [returnModalOpen, setReturnModalOpen] = React.useState(false);

	const handleNextState = React.useCallback(() => {
		handleSubmit();
	}, [handleSubmit]);

	const handleOpenModalConfirmation = React.useCallback(() => {
		setReturnModalOpen(true);
	}, []);

	const handleModalAcceptReturn = React.useCallback(() => {
		handlePrevious();
	}, [handlePrevious]);

	const handleModalDenyReturn = React.useCallback(() => {
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
					<Card.Title>
						{configState.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT
							? t("rental_signature.agreement_title")
							: t("rental_signature.reservation_title")}
					</Card.Title>
					<Card.Subtitle>
						{configState.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT
							? t("rental_signature.agreement_message")
							: t("rental_signature.reservation_message")}
					</Card.Subtitle>
					<div className='mt-3 d-grid'>
						<Row>
							<Col md={12}>
								<div style={{ height: 300 }}>signature canvas</div>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								<div className='d-flex justify-content-center'>
									<Button variant='danger' style={{ width: "90%" }}>
										{t("rental_signature.clear_input")}
									</Button>
								</div>
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

export default DefaultRentalSignatureController;
