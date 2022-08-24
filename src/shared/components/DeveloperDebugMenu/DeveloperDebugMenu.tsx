import React from "react";
import { useTranslation } from "react-i18next";

import { supportedLanguages } from "../../redux/slices/config/slice";
import { ALL_SCREEN_FLOWS, ALL_SUCCESS_SCREENS, APP_CONSTANTS, REPO_URL } from "../../utils/constants";
import { isValueTrue } from "../../utils/common";
import { devConfigToQueryUrl } from "./utils";

import TextInput from "../Elements/TextInput";
import CheckInput from "../Elements/CheckInput";
import SelectInput from "../Elements/SelectInput";
import AnchorLink from "../Elements/AnchorLink";
import Button from "../Elements/Button";
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
};

export const initialConfigState: DevConfigObject = {
  referenceId: "0",
  referenceType: "Reservation",
  lang: "en",
  qa: false,
  dev: true,
  clientId: "0",
  emailTemplateId: "0",
  flow: [ALL_SCREEN_FLOWS[0].value],
  fromRentall: true,
  successSubmissionScreen: APP_CONSTANTS.SUCCESS_SCREEN_DEFAULT,
};

const DeveloperDebugMenu = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <React.Fragment>
      <CardLayout
        title={
          <div className="flex align-middle justify-center">
            <h1 className="flex-1">{t("developer.drawerTitle")}</h1>
            <div>
              <Button variant="danger" size="sm" onClick={handleClose}>
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
    </React.Fragment>
  );
};

const ConfigCreator: React.FC = () => {
  const { t } = useTranslation();
  const SELECT_MENU_DEFAULT_KEY = t("developer.configCreator.formSelectValue");

  const [initialConfig, setInitialConfig] = React.useState<DevConfigObject>(initialConfigState);
  const [config, setConfig] = React.useState<DevConfigObject>(initialConfigState);

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

    const formObject: DevConfigObject = {
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
      successSubmissionScreen: readConfig.successSubmissionScreen ?? initialConfigState.successSubmissionScreen,
    };

    setConfig(formObject);
    setInitialConfig(formObject);
  }, []);

  return (
    <React.Fragment>
      <div className="pt-1 pb-3">
        <AnchorLink href={REPO_URL} rel="noreferrer" target="_blank">
          {t("developer.viewProjectRepo")}
        </AnchorLink>
      </div>
      <div className="p-2 rounded w-full bg-amber-100 flex flex-col gap-1" style={{ overflowWrap: "anywhere" }}>
        <p className="m-0 text-sm text-gray-600">{devConfigToQueryUrl(config)}</p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(devConfigToQueryUrl(config));
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
        <div className="mb-3">
          <span className="text-gray-600">{t("developer.configCreator.referenceType")}</span>
          <div>
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
        <div className="mb-3">
          <TextInput
            type="text"
            value={config.referenceId}
            name="referenceId"
            onChange={handleNormalInputChange}
            label={t("developer.configCreator.referenceId")}
            required
          />
        </div>
        <div className="mb-3">
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
        <div className="mb-3">
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
        <div className="mb-3">
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

        <div className="mb-3">
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
            <ol className="list-decimal ml-6 mt-3">
              {config.flow.map((flowItem, index) => (
                <li key={`flow-item-${flowItem}-${index}`}>
                  <div className="flex align-middle items-center gap-1 px-2 py-1 bg-gray-100 rounded my-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveFlowItem(index)}
                      className="bg-red-500 text-white text-sm h-5 aspect-square rounded-full flex align-middle justify-center"
                    >
                      &times;
                    </button>
                    <div className="flex-1 truncate">
                      <span className="font-bold text-sm">{flowItem}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mb-3">
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
        {/*  */}
        <div className="my-3 grid grid-cols-2 gap-2">
          <div>
            <span>{t("developer.configCreator.applicationBranding")}</span>
            <CheckInput
              type="checkbox"
              name="fromRentall"
              checked={config.fromRentall}
              onChange={handleNormalInputChange}
              label={config.fromRentall ? "RENTALL" : "Navotar"}
            />
          </div>
          <div>
            <span>{t("developer.configCreator.applicationEnvironment")}</span>
            <CheckInput
              type="checkbox"
              name="qa"
              checked={config.qa}
              onChange={handleNormalInputChange}
              label={
                config.qa
                  ? t("developer.configCreator.environmentQa")
                  : t("developer.configCreator.environmentProduction")
              }
            />
          </div>

          <div>
            <span>{t("developer.configCreator.openedDevMenu")}</span>
            <CheckInput
              type="checkbox"
              name="dev"
              checked={config.dev}
              onChange={handleNormalInputChange}
              label={
                config.dev ? t("developer.configCreator.devMenuOpened") : t("developer.configCreator.devMenuClosed")
              }
            />
          </div>
        </div>
        <div className="my-3 w-full flex gap-1">
          <Button type="submit" className="py-2 px-4 bg-gray-300">
            {t("developer.configCreator.btnSave")}
          </Button>
          <Button type="button" variant="secondary" className="py-2 px-4 bg-teal-300" onClick={handleReset}>
            {t("developer.configCreator.btnReset")}
          </Button>
        </div>
      </form>
    </React.Fragment>
  );
};

export default DeveloperDebugMenu;
