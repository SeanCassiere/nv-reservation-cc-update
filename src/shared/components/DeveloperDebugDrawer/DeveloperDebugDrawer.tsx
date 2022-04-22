import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";

import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";

import { supportedLanguages } from "../../redux/slices/config/slice";
import { ALL_SCREEN_FLOWS, APP_CONSTANTS } from "../../utils/constants";
import { isValueTrue } from "../../utils/common";

type ConfigObject = {
	referenceId: string;
	referenceType: string;
	lang: string;
	qa: boolean;
	clientId: string;
	emailTemplateId: string;
	flow: string[];
	fromRentall: boolean;
};

const SELECT_MENU_DEFAULT_KEY = "Select";

const initialConfigState: ConfigObject = {
	referenceId: "0",
	referenceType: "Reservation",
	lang: "en",
	qa: false,
	clientId: "0",
	emailTemplateId: "0",
	flow: ["Default/CreditCardForm"],
	fromRentall: true,
};

const DeveloperDebugDrawer = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
	const [initialConfig, setInitialConfig] = React.useState<ConfigObject>(initialConfigState);
	const [config, setConfig] = React.useState<ConfigObject>(initialConfigState);

	const [showCopiedMessage, setShowCopiedMessage] = React.useState(false);

	// general input handler
	const handleNormalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.type === "checkbox") {
			setConfig((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
		} else {
			setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
		}
	};

	// general select handler
	const handleSelectInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === SELECT_MENU_DEFAULT_KEY) {
			return;
		}
		setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	// handle selecting the flow items
	const handleSelectFlowItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setConfig((prev) => ({ ...prev, flow: [...prev.flow, e.target.value] }));
	};

	const handleRemoveFlowItem = (idx: number) => {
		if (config.flow.length === 1) {
			setConfig((prev) => ({ ...prev, flow: [ALL_SCREEN_FLOWS[0].value] }));
		} else {
			setConfig((prev) => ({
				...prev,
				flow: [...prev.flow.slice(0, idx), ...prev.flow.slice(idx + 1)],
			}));
		}
	};

	const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		const queryString = devConfigToQueryUrl(config);
		const location = window.location.href.split("?")[0];
		const newUrl = `${location}${queryString}`;
		console.log(newUrl);
		window.location.href = newUrl;
	};

	const handleReset = () => {
		setConfig(initialConfig);
	};

	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const lang = query.get("lang");
		const qa = query.get("qa");
		const agreementId = query.get("agreementId");
		const reservationId = query.get("reservationId");

		const queryConfig = query.get("config");
		const readConfig = JSON.parse(
			Buffer.from(queryConfig ?? btoa(JSON.stringify(initialConfigState)), "base64").toString("ascii")
		);

		const formObject: ConfigObject = {
			referenceId: agreementId ?? reservationId ?? "0",
			referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
			lang: lang ?? "en",
			qa: Boolean(isValueTrue(qa)),
			clientId: `${readConfig.clientId}`,
			emailTemplateId: `${readConfig.emailTemplateId}`,
			flow: readConfig.flow,
			fromRentall: readConfig.fromRentall !== undefined ? readConfig.fromRentall : true,
		};

		setConfig(formObject);
		setInitialConfig(formObject);
	}, []);

	return (
		<React.Fragment>
			<Offcanvas show={open} onHide={handleClose} placement='end' name='Developer Menu'>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Developer Menu</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<div
						className='p-2 rounded w-100 bg-light'
						style={{ overflowWrap: "anywhere", cursor: "pointer" }}
						onClick={() => {
							navigator.clipboard.writeText(devConfigToQueryUrl(config));
							setShowCopiedMessage(true);
							setTimeout(() => {
								setShowCopiedMessage(false);
							}, 2000);
						}}
					>
						{devConfigToQueryUrl(config)}
					</div>
					<Alert className='mt-2' show={showCopiedMessage} variant='success'>
						Copied to clipboard
					</Alert>
					<Form onSubmit={handleSubmit} className='mt-3'>
						<Form.Group className='mb-3'>
							<Form.Label>ReferenceType</Form.Label>
							<Form.Check
								type='radio'
								name='referenceType'
								value={APP_CONSTANTS.REF_TYPE_RESERVATION}
								label={APP_CONSTANTS.REF_TYPE_RESERVATION}
								checked={config.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION}
								id='devForm.ReferenceType.Reservation'
								onChange={handleNormalInputChange}
							/>
							<Form.Check
								type='radio'
								name='referenceType'
								value={APP_CONSTANTS.REF_TYPE_AGREEMENT}
								label={APP_CONSTANTS.REF_TYPE_AGREEMENT}
								checked={config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT}
								id='devForm.ReferenceType.Agreement'
								onChange={handleNormalInputChange}
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.referenceId'>
							<Form.Label>Reference ID</Form.Label>
							<Form.Control
								type='number'
								value={config.referenceId}
								name='referenceId'
								onChange={handleNormalInputChange}
								min='0'
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.lang'>
							<Form.Label>Language</Form.Label>
							<Form.Select value={config.lang} name='lang' id='lang' required onChange={handleSelectInputChange}>
								<option>{SELECT_MENU_DEFAULT_KEY}</option>
								{supportedLanguages.map((langItem) => (
									<option value={langItem} key={`language-${langItem}`}>
										{langItem}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.clientId'>
							<Form.Label>Client ID</Form.Label>
							<Form.Control
								type='number'
								value={config.clientId}
								name='clientId'
								onChange={handleNormalInputChange}
								min='0'
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.emailTemplateId'>
							<Form.Label>Response Email Template ID</Form.Label>
							<Form.Control
								type='number'
								value={config.emailTemplateId}
								name='emailTemplateId'
								onChange={handleNormalInputChange}
								min='0'
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.flow'>
							<Form.Label>Flows</Form.Label>
							<Form.Select name='flow' id='flow' onChange={handleSelectFlowItem}>
								{ALL_SCREEN_FLOWS.map((flowItem) => (
									<option value={flowItem.value} key={`select-flow-${flowItem.value}`}>
										{flowItem.label}
									</option>
								))}
							</Form.Select>
							<ListGroup as='ol' className='mt-2' numbered>
								{config.flow.map((flowItem, index) => (
									<ListGroup.Item
										key={`flow-item-${flowItem}`}
										as='li'
										className='d-flex justify-content-between align-items-start'
									>
										<div className='ms-2 me-auto'>
											<div className='fw-bold'>{flowItem}</div>
										</div>
										<Button variant='outline-danger' size='sm' onClick={() => handleRemoveFlowItem(index)}>
											&times;
										</Button>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Branding</Form.Label>
							<Form.Check
								type='switch'
								name='fromRentall'
								className='ml-3'
								label={config.fromRentall ? "RENTALL" : "Navotar"}
								checked={config.fromRentall}
								id='devForm.fromRentall'
								onChange={handleNormalInputChange}
							/>
						</Form.Group>
						<Form.Group className='mb-3'>
							<Form.Label>Environment</Form.Label>
							<Form.Check
								type='switch'
								name='qa'
								className='ml-3'
								label={config.qa ? "QA" : "Production"}
								checked={config.qa}
								id='devForm.qa'
								onChange={handleNormalInputChange}
							/>
						</Form.Group>
						<Form.Group className='mg-5'>
							<ButtonGroup className='mb-2'>
								<Button type='submit'>Run new config</Button>
								<Button variant='warning' onClick={handleReset}>
									Reset
								</Button>
							</ButtonGroup>
						</Form.Group>
					</Form>
				</Offcanvas.Body>
			</Offcanvas>
		</React.Fragment>
	);
};

function devConfigToQueryUrl(config: ConfigObject) {
	let queryString = "?";

	// use qa server
	if (config.qa) {
		queryString += "&qa=true&";
	}

	// setting agreementId or reservationId
	if (config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT) {
		queryString += `agreementId=${config.referenceId}`;
	} else {
		queryString += `reservationId=${config.referenceId}`;
	}

	// setting lang
	queryString += `&lang=${config.lang}`;

	// setting the config
	const hashObj = {
		clientId: parseInt(config.clientId) ?? 0,
		emailTemplateId: Number(config.emailTemplateId) ?? 0,
		flow: config.flow,
		fromRentall: config.fromRentall,
	};
	let objJsonStr = JSON.stringify(hashObj);
	let objJsonB64 = btoa(objJsonStr);
	queryString += "&config=" + objJsonB64;

	return queryString;
}

export default DeveloperDebugDrawer;
