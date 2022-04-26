import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useTranslation } from "react-i18next";

import { useMediaQuery } from "react-responsive";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

import { supportedLanguages } from "../../redux/slices/config/slice";
import { ALL_SCREEN_FLOWS, APP_CONSTANTS } from "../../utils/constants";
import { isValueTrue } from "../../utils/common";

type ConfigObject = {
	referenceId: string;
	referenceType: string;
	lang: string;
	qa: boolean;
	dev: boolean;
	clientId: string;
	emailTemplateId: string;
	flow: string[];
	fromRentall: boolean;
};

const initialConfigState: ConfigObject = {
	referenceId: "0",
	referenceType: "Reservation",
	lang: "en",
	qa: false,
	dev: true,
	clientId: "0",
	emailTemplateId: "0",
	flow: [ALL_SCREEN_FLOWS[0].value],
	fromRentall: true,
};

const DeveloperDebugDrawer = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
	const { t } = useTranslation();
	const isPhone = useMediaQuery({ query: "(max-width: 400px)" });
	const SELECT_MENU_DEFAULT_KEY = t("developer.config_creator.form_select_value");

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
		const queryStringUrl = devConfigToQueryUrl(config);
		window.location.href = queryStringUrl;
	};

	const handleReset = (e: React.SyntheticEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setConfig(initialConfig);
	};

	React.useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const lang = query.get("lang");
		const qa = query.get("qa");
		const dev = query.get("dev");
		const agreementId = query.get("agreementId");
		const reservationId = query.get("reservationId");

		const queryConfig = query.get("config");
		const readConfig = JSON.parse(
			Buffer.from(queryConfig ?? btoa(JSON.stringify(initialConfigState)), "base64").toString("ascii")
		);

		const formObject: ConfigObject = {
			referenceId: agreementId ?? reservationId ?? initialConfigState.clientId,
			referenceType: agreementId ? APP_CONSTANTS.REF_TYPE_AGREEMENT : APP_CONSTANTS.REF_TYPE_RESERVATION,
			lang: lang ?? initialConfigState.lang,
			qa: Boolean(isValueTrue(qa)),
			dev: Boolean(isValueTrue(dev)),
			clientId: readConfig.clientId ? `${readConfig.clientId}` : initialConfigState.clientId,
			emailTemplateId: readConfig.emailTemplateId
				? `${readConfig.emailTemplateId}`
				: initialConfigState.emailTemplateId,
			flow: readConfig.flow ?? initialConfigState.flow,
			fromRentall: readConfig.fromRentall !== undefined ? readConfig.fromRentall : initialConfigState.fromRentall,
		};

		setConfig(formObject);
		setInitialConfig(formObject);
	}, []);

	return (
		<React.Fragment>
			<Offcanvas show={open} onHide={handleClose} placement='end' name='Developer Menu'>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>{t("developer.drawer_title")}</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body className='mt-0 pt-0'>
					<div className='p-2 rounded w-100 bg-light d-flex flex-column gap-1' style={{ overflowWrap: "anywhere" }}>
						<p className='m-0'>{devConfigToQueryUrl(config)}</p>
						<Button
							size='sm'
							onClick={() => {
								navigator.clipboard.writeText(devConfigToQueryUrl(config));
								setShowCopiedMessage(true);
								setTimeout(() => {
									setShowCopiedMessage(false);
								}, 1250);
							}}
							variant='outline-secondary'
						>
							{showCopiedMessage
								? t("developer.config_creator.btn_copied_to_clipboard")
								: t("developer.config_creator.btn_copy")}
						</Button>
					</div>
					<Form onSubmit={handleSubmit} className='mt-3'>
						<Form.Group className='mb-3' controlId='devForm.referenceType'>
							<Form.Label>{t("developer.config_creator.reference_type")}</Form.Label>
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
							<Form.Label>{t("developer.config_creator.reference_id")}</Form.Label>
							<Form.Control
								type='text'
								value={config.referenceId}
								name='referenceId'
								onChange={handleNormalInputChange}
								min='0'
								required
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.lang'>
							<Form.Label>{t("developer.config_creator.lang")}</Form.Label>
							<Form.Select
								value={config.lang}
								name='lang'
								id='devForm.lang'
								required
								onChange={handleSelectInputChange}
							>
								<option>{SELECT_MENU_DEFAULT_KEY}</option>
								{supportedLanguages.map((langItem) => (
									<option value={langItem} key={`language-${langItem}`}>
										{langItem}
									</option>
								))}
							</Form.Select>
						</Form.Group>
						<Form.Group className='mb-3' controlId='devForm.clientId'>
							<Form.Label>{t("developer.config_creator.client_id")}</Form.Label>
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
							<Form.Label>{t("developer.config_creator.response_template_id")}</Form.Label>
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
							<Form.Label>{t("developer.config_creator.application_flows")}</Form.Label>
							<Form.Select name='flow' id='devForm.flow' onChange={handleSelectFlowItem}>
								{ALL_SCREEN_FLOWS.map((flowItem) => (
									<option value={flowItem.value} key={`select-flow-${flowItem.value}`}>
										{flowItem.label}
									</option>
								))}
							</Form.Select>
							<ListGroup as={isPhone ? "ul" : "ol"} className='mt-2' numbered={!isPhone}>
								{config.flow.map((flowItem, index) => (
									<ListGroup.Item
										key={`flow-item-${flowItem}-${index}`}
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
						<Row>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>{t("developer.config_creator.application_branding")}</Form.Label>
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
							</Col>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>{t("developer.config_creator.application_environment")}</Form.Label>
									<Form.Check
										type='switch'
										name='qa'
										className='ml-3'
										label={
											config.qa
												? t("developer.config_creator.environment_qa")
												: t("developer.config_creator.environment_production")
										}
										checked={config.qa}
										id='devForm.qa'
										onChange={handleNormalInputChange}
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group className='mb-3'>
									<Form.Label>{t("developer.config_creator.opened_dev_menu")}</Form.Label>
									<Form.Check
										type='switch'
										name='dev'
										className='ml-3'
										label={
											config.dev
												? t("developer.config_creator.dev_menu_opened")
												: t("developer.config_creator.dev_menu_closed")
										}
										checked={config.dev}
										id='devForm.dev'
										onChange={handleNormalInputChange}
									/>
								</Form.Group>
							</Col>
						</Row>
						<Form.Group className='mg-5'>
							<ButtonGroup className='mb-2 w-100'>
								<Button type='submit'>{t("developer.config_creator.btn_save")}</Button>
								<Button variant='outline-warning' onClick={handleReset}>
									{t("developer.config_creator.btn_reset")}
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
		queryString += "qa=true";
	}

	// open dev menu by default
	if (config.dev) {
		if (config.qa) {
			queryString += "&";
		}
		queryString += "dev=true";
	}

	// based on qa or dev flags, append & into the query string
	if (config.qa || config.dev) {
		queryString += "&";
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
		clientId: Number(config.clientId) ?? Number(initialConfigState.clientId),
		emailTemplateId: Number(config.emailTemplateId) ?? Number(initialConfigState.emailTemplateId),
		flow: config.flow ?? initialConfigState.flow,
		fromRentall: config.fromRentall !== undefined ? config.fromRentall : initialConfigState.fromRentall,
	};
	let objJsonStr = JSON.stringify(hashObj);
	let objJsonB64 = btoa(objJsonStr);
	queryString += "&config=" + objJsonB64;

	const location = window.location.href.split("?")[0];
	const newUrl = `${location}${queryString}`;

	return newUrl;
}

export default DeveloperDebugDrawer;
