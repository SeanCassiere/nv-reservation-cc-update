import React, { useCallback, useState } from "react";
import { Card, Row, Col, Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

import { selectTranslations } from "../../redux/store";

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
	const [returnModalOpen, setReturnModalOpen] = useState(false);

	const handleNextState = useCallback(() => {
		handleSubmit();
	}, [handleSubmit]);

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
				<Modal.Body>Going back to the previous page will discard all added files.</Modal.Body>
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
					<Card.Subtitle>Upload a copy of your driver's license</Card.Subtitle>
					<div className='mt-4 d-grid'>
						<Row>
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
