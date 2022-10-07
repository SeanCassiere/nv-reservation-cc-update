import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ALL_SCREEN_FLOWS, ALL_SUCCESS_SCREENS, APP_CONSTANTS, REPO_URL } from "../../utils/constants";
import { supportedLanguages } from "../../i18n";
import { isValueTrue } from "../../utils/common";
import { devConfigToQueryUrl } from "./utils";

import { useConfigStore } from "../../hooks/stores/useConfigStore";
import { useRuntimeStore } from "../../hooks/stores/useRuntimeStore";

import TextInput from "../Elements/Default/TextInput";
import CheckInput from "../Elements/Default/CheckInput";
import SelectInput from "../Elements/Default/SelectInput";
import AnchorLink from "../Elements/Default/AnchorLink";
import Button from "../Elements/Default/Button";
import CardLayout from "../../layouts/Card";

export type DevConfigObject = {
  referenceId: string;
  referenceType: string;
  lang: string;
  qa: boolean;
  dev: boolean;
  clientId: string;
  emailTemplateId: string;
  flow: string[];
  fromRentall: boolean;
  successSubmissionScreen: string;
  showPreSubmitSummary: boolean;
  stopEmailGlobalDocuments: boolean;
  stopAttachingDriverLicenseFiles: boolean;
};

const outsideInitialConfigState: DevConfigObject = {
  referenceId: "0",
  referenceType: "Reservation",
  lang: "en",
  qa: false,
  dev: true,
  clientId: "0",
  emailTemplateId: "0",
  flow: [ALL_SCREEN_FLOWS[0].value],
  fromRentall: true,
  showPreSubmitSummary: false,
  successSubmissionScreen: APP_CONSTANTS.SUCCESS_DEFAULT,
  stopEmailGlobalDocuments: false,
  stopAttachingDriverLicenseFiles: false,
};

const DeveloperDebugMenu: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
  const { t } = useTranslation();
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      divRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open]);

  if (!open) return null;

  return (
    <div ref={divRef}>
      <CardLayout
        title={
          <div className="flex justify-center align-middle">
            <h1 className="flex-1">{t("developer.drawerTitle")}</h1>
            <div>
              <Button color="danger" size="sm" onClick={handleClose}>
                &times;
              </Button>
            </div>
          </div>
        }
      >
        <div className="mt-0 pt-0">
          <ConfigCreator />
        </div>
      </CardLayout>
    </div>
  );
};

const ConfigCreator: React.FC = () => {
  const { t, i18n } = useTranslation();
  const SELECT_MENU_DEFAULT_KEY = t("developer.configCreator.formSelectValue");

  const { referenceIdentifier, referenceType, clientId, responseTemplateId } = useRuntimeStore();
  const {
    successSubmissionScreen,
    fromRentall,
    flow,
    qa,
    rawQueryString,
    showPreSubmitSummary,
    disableGlobalDocumentsForConfirmationEmail,
    disableEmailAttachingDriverLicense,
  } = useConfigStore();

  const [isReady, setIsReady] = React.useState(false);
  const [initialConfig, setInitialConfig] = React.useState<DevConfigObject>(outsideInitialConfigState);
  const [config, setConfig] = React.useState<DevConfigObject>(outsideInitialConfigState);

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
    window.location.href = window.location.origin + "/?" + queryStringUrl;
  };

  const handleReset = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setConfig(initialConfig);
  };

  React.useEffect(() => {
    const query = new URLSearchParams(rawQueryString);
    const dev = query.get("dev");
    const body = {
      referenceId: `${referenceIdentifier || 0}`,
      referenceType: `${referenceType}`,
      lang: i18n.language,
      qa: qa,
      dev: false,
      clientId: `${clientId || 0}`,
      emailTemplateId: `${responseTemplateId || 0}`,
      flow: [...flow],
      fromRentall: fromRentall,
      successSubmissionScreen: `${successSubmissionScreen}`,
      showPreSubmitSummary: showPreSubmitSummary ?? outsideInitialConfigState.showPreSubmitSummary,
      stopEmailGlobalDocuments: disableGlobalDocumentsForConfirmationEmail,
      stopAttachingDriverLicenseFiles: disableEmailAttachingDriverLicense,
    };
    setConfig((prev) => ({ ...prev, ...body, dev: Boolean(isValueTrue(dev)) }));
    setInitialConfig((prev) => ({ ...prev, ...body, dev: Boolean(isValueTrue(dev)) }));
    setIsReady(true);
  }, [
    i18n.language,
    clientId,
    flow,
    fromRentall,
    qa,
    rawQueryString,
    referenceIdentifier,
    referenceType,
    responseTemplateId,
    successSubmissionScreen,
    showPreSubmitSummary,
    disableGlobalDocumentsForConfirmationEmail,
    disableEmailAttachingDriverLicense,
  ]);

  if (!isReady) {
    return <div>still loading...</div>;
  }

  return (
    <React.Fragment>
      <div className="pt-1 pb-3">
        <AnchorLink href={REPO_URL} rel="noreferrer" target="_blank" className="text-indigo-600">
          {t("developer.viewProjectRepo")}
        </AnchorLink>
      </div>
      <div className="flex w-full flex-col gap-1 rounded bg-yellow-50 p-2" style={{ overflowWrap: "anywhere" }}>
        <p className="m-0 text-sm text-gray-700">{window.location.origin + "/?" + devConfigToQueryUrl(config)}</p>
        <Button
          type="button"
          color="primary"
          variant="muted"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + "/?" + devConfigToQueryUrl(config));
            setShowCopiedMessage(true);
            setTimeout(() => {
              setShowCopiedMessage(false);
            }, 1250);
          }}
        >
          {showCopiedMessage ? t("developer.configCreator.btnCopiedToClipboard") : t("developer.configCreator.btnCopy")}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-4">
          <span className="select-none text-sm font-medium text-gray-700">
            {t("developer.configCreator.referenceType")}
          </span>
          <div className="mt-1 flex flex-col gap-1">
            <CheckInput
              type="radio"
              name="referenceType"
              value={APP_CONSTANTS.REF_TYPE_RESERVATION}
              checked={config.referenceType === APP_CONSTANTS.REF_TYPE_RESERVATION}
              onChange={handleNormalInputChange}
              label={APP_CONSTANTS.REF_TYPE_RESERVATION}
            />
            <CheckInput
              type="radio"
              name="referenceType"
              value={APP_CONSTANTS.REF_TYPE_AGREEMENT}
              checked={config.referenceType === APP_CONSTANTS.REF_TYPE_AGREEMENT}
              onChange={handleNormalInputChange}
              label={APP_CONSTANTS.REF_TYPE_AGREEMENT}
            />
          </div>
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            value={config.referenceId}
            name="referenceId"
            onChange={handleNormalInputChange}
            label={t("developer.configCreator.referenceId")}
            required
          />
        </div>
        <div className="mb-4">
          <div>
            <SelectInput
              value={config.lang}
              name="lang"
              required
              label={t("developer.configCreator.lang")}
              onChange={handleSelectInputChange}
            >
              <option>{SELECT_MENU_DEFAULT_KEY}</option>
              {supportedLanguages.map((langItem) => (
                <option value={langItem} key={`language-${langItem}`}>
                  {langItem}
                </option>
              ))}
            </SelectInput>
          </div>
        </div>
        <div className="mb-4">
          <TextInput
            type="number"
            value={config.clientId}
            name="clientId"
            onChange={handleNormalInputChange}
            min="0"
            label={t("developer.configCreator.clientId")}
            required
          />
        </div>
        {/*  confirmation email settings  */}
        <div className="mb-4 rounded border border-gray-100 px-4 pt-2 pb-4">
          <span className="select-none text-sm font-medium text-gray-700">
            {t("developer.configCreator.confirmationEmailSettings")}
          </span>
          <div className="mt-2 flex flex-col gap-2 px-2">
            <div>
              <TextInput
                type="number"
                value={config.emailTemplateId}
                name="emailTemplateId"
                onChange={handleNormalInputChange}
                min="0"
                label={t("developer.configCreator.responseTemplateId")}
                required
              />
            </div>
            <div>
              <span className="select-none text-sm font-medium text-gray-700">
                {t("developer.configCreator.disableGlobalDocumentsForConfirmationEmail")}
              </span>
              <CheckInput
                type="checkbox"
                name="stopEmailGlobalDocuments"
                checked={config.stopEmailGlobalDocuments}
                onChange={handleNormalInputChange}
                label={
                  config.stopEmailGlobalDocuments ? t("developer.configCreator.yes") : t("developer.configCreator.no")
                }
              />
            </div>
            <div>
              <span className="select-none text-sm font-medium text-gray-700">
                {t("developer.configCreator.disableLicenseAttachmentsForConfirmationEmail")}
              </span>
              <CheckInput
                type="checkbox"
                name="stopAttachingDriverLicenseFiles"
                checked={config.stopAttachingDriverLicenseFiles}
                onChange={handleNormalInputChange}
                label={
                  config.stopAttachingDriverLicenseFiles
                    ? t("developer.configCreator.yes")
                    : t("developer.configCreator.no")
                }
              />
            </div>
          </div>
        </div>
        {/* application flow settings */}
        <div className="mb-4 rounded border border-gray-100 px-4 pt-2 pb-4">
          <span className="select-none text-sm font-medium text-gray-700">
            {t("developer.configCreator.applicationFlowSettings")}
          </span>
          <div className="mt-2 flex flex-col gap-2 px-2">
            <div>
              <SelectInput
                name="flow"
                onChange={handleSelectFlowItem}
                label={t("developer.configCreator.applicationFlows")}
              >
                {ALL_SCREEN_FLOWS.map((flowItem) => (
                  <option value={flowItem.value} key={`select-flow-${flowItem.value}`}>
                    {flowItem.label}
                  </option>
                ))}
              </SelectInput>
              <div>
                <ol className="ml-6 mt-3 list-decimal">
                  {config.flow.map((flowItem, index) => (
                    <li key={`flow-item-${flowItem}-${index}`}>
                      <div className="my-1 flex items-center gap-3 rounded bg-gray-100 px-2 py-2 align-middle">
                        <button
                          type="button"
                          onClick={() => handleRemoveFlowItem(index)}
                          className="flex aspect-square h-5 justify-center rounded-full bg-red-500 align-middle text-sm text-white"
                        >
                          &times;
                        </button>
                        <div className="flex-1 truncate">
                          <span className="text-sm font-medium">{flowItem}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div>
              <SelectInput
                name="successSubmissionScreen"
                defaultValue={config.successSubmissionScreen}
                onChange={handleSelectInputChange}
                label={t("developer.configCreator.applicationSuccessScreen")}
              >
                {ALL_SUCCESS_SCREENS.map((successScreen) => (
                  <option value={successScreen.value} key={`select-successSubmissionScreen-${successScreen.value}`}>
                    {successScreen.label}
                  </option>
                ))}
              </SelectInput>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                {t("developer.configCreator.showPreSubmitSummary")}
              </span>
              <CheckInput
                type="checkbox"
                name="showPreSubmitSummary"
                checked={config.showPreSubmitSummary}
                onChange={handleNormalInputChange}
                label={config.showPreSubmitSummary ? t("developer.configCreator.yes") : t("developer.configCreator.no")}
              />
            </div>
          </div>
        </div>

        {/*  */}
        <div className="mt-4 mb-4 grid grid-cols-2 gap-3">
          <div className="col-span-2 md:col-span-1">
            <span className="select-none text-sm font-medium text-gray-700">
              {t("developer.configCreator.applicationBranding")}
            </span>
            <CheckInput
              type="checkbox"
              name="fromRentall"
              checked={config.fromRentall}
              onChange={handleNormalInputChange}
              label={config.fromRentall ? "RENTALL" : "Navotar"}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="select-none text-sm font-medium text-gray-700">
              {t("developer.configCreator.applicationEnvironment")}
            </span>
            <CheckInput
              type="checkbox"
              name="qa"
              checked={config.qa}
              onChange={handleNormalInputChange}
              label={config.qa ? t("developer.configCreator.yes") : t("developer.configCreator.no")}
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <span className="select-none text-sm font-medium text-gray-700">
              {t("developer.configCreator.openedDevMenu")}
            </span>
            <CheckInput
              type="checkbox"
              name="dev"
              checked={config.dev}
              onChange={handleNormalInputChange}
              label={config.dev ? t("developer.configCreator.yes") : t("developer.configCreator.no")}
            />
          </div>
        </div>

        <div className="mt-6 flex w-full gap-1">
          <Button type="submit" className="bg-gray-300 py-2 px-4">
            {t("developer.configCreator.btnSave")}
          </Button>
          <Button type="button" color="primary" variant="muted" className="bg-teal-300 py-2 px-4" onClick={handleReset}>
            {t("developer.configCreator.btnReset")}
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default DeveloperDebugMenu;
