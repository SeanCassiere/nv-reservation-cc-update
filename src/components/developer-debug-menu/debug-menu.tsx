import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CardLayout from "@/components/card-layout";
import AnchorLink from "@/components/anchor-link";

import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";

import { supportedLanguages } from "@/i18n";
import { isValueTrue } from "@/utils/common";
import { ALL_SCREEN_FLOWS, ALL_SUCCESS_SCREENS, APP_CONSTANTS, REPO_URL } from "@/utils/constants";

import { configObjectFormSchema, ConfigObjectFormValues, makeUrlQueryFromConfigObject } from "./utils";

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
              <Button size="icon" variant="secondary" onClick={handleClose}>
                &times;
              </Button>
            </div>
          </div>
        }
      >
        <div className="mt-0 pt-0">
          <div className="pb-3 pt-1">
            <AnchorLink href={REPO_URL} rel="noreferrer" target="_blank" className="font-bold text-primary/75">
              {t("developer.viewProjectRepo")}
            </AnchorLink>
          </div>
          <ConfigCreator />
        </div>
      </CardLayout>
    </div>
  );
};

const ConfigCreator = () => {
  const { t, i18n } = useTranslation();

  const [showCopiedMessage, setShowCopiedMessage] = React.useState(false);

  const rs = useRuntimeStore();
  const cs = useConfigStore();
  const queryParams = new URLSearchParams(cs.rawQueryString);
  const queryDev = queryParams.get("dev");

  const form = useForm<ConfigObjectFormValues & { flowName: string }>({
    resolver: zodResolver(configObjectFormSchema),
    defaultValues: {
      referenceId: rs.referenceIdentifier ? String(rs.referenceIdentifier) : "0",
      referenceType: rs.referenceType,
      lang: i18n.language,
      qa: cs.qa,
      dev: Boolean(isValueTrue(queryDev)),
      clientId: rs.clientId ? String(rs.clientId) : "0",
      userId: cs.predefinedAdminUserId ? String(cs.predefinedAdminUserId) : "0",
      emailTemplateId: rs.responseTemplateId ? String(rs.responseTemplateId) : "0",
      flow: [...cs.flow],
      showPreSubmitSummary: cs.showPreSubmitSummary,
      successSubmissionScreen: cs.successSubmissionScreen,
      stopEmailGlobalDocuments: cs.disableGlobalDocumentsForConfirmationEmail,
      stopAttachingDriverLicenseFiles: cs.disableEmailAttachingDriverLicense,
      flowName: "",
    },
  });
  const formValues = form.watch();

  // handle selecting the flow items
  const handleSelectFlowItem = (newFlow: string, prevFlow: string[]) => {
    form.setValue("flow", [...prevFlow, newFlow]);
  };
  const handleRemoveFlowItem = (idx: number, prevFlow: string[]) => {
    if (prevFlow.length === 1) {
      form.setValue("flow", [ALL_SCREEN_FLOWS[0].value]);
    } else {
      form.setValue("flow", [...prevFlow.slice(0, idx), ...prevFlow.slice(idx + 1)]);
    }
  };

  const newQueryString = makeUrlQueryFromConfigObject(formValues);

  const handleSubmit = form.handleSubmit(async (data) => {
    const queryStringUrl = makeUrlQueryFromConfigObject(data);
    window.location.href = window.location.origin + "/?" + queryStringUrl;
  }, console.error);

  return (
    <Form {...form}>
      <form className="flex-col space-y-4" onSubmit={handleSubmit} onReset={() => form.reset()}>
        <DevGroupCard title={t("developer.configCreator.newUrl")}>
          <p className="m-0 text-sm text-primary" style={{ overflowWrap: "anywhere" }}>
            {window.location.origin + "/?" + newQueryString}
          </p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.origin + "/?" + newQueryString);
              setShowCopiedMessage(true);
              setTimeout(() => {
                setShowCopiedMessage(false);
              }, 1250);
            }}
          >
            {showCopiedMessage
              ? t("developer.configCreator.btnCopiedToClipboard")
              : t("developer.configCreator.btnCopy")}
          </Button>
        </DevGroupCard>

        <DevGroupCard title={t("developer.configCreator.runtimeConfiguration")}>
          <FormField
            control={form.control}
            name="referenceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.referenceId")}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} placeholder="eg: 78372813" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referenceType"
            render={({ field }) => (
              <FormItem className="mt-1 space-y-3">
                <FormLabel>{t("developer.configCreator.referenceType")}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={APP_CONSTANTS.REF_TYPE_RESERVATION} />
                      </FormControl>
                      <FormLabel className="font-normal">{APP_CONSTANTS.REF_TYPE_RESERVATION}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={APP_CONSTANTS.REF_TYPE_AGREEMENT} />
                      </FormControl>
                      <FormLabel className="font-normal">{APP_CONSTANTS.REF_TYPE_AGREEMENT}</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </DevGroupCard>

        <DevGroupCard title={t("developer.configCreator.generalApplicationConfiguration")}>
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.clientId")}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} placeholder="eg: 1013" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.lang")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("developer.configCreator.formSelectValue")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {supportedLanguages.map((langItem) => (
                      <SelectItem key={`dev-language-${langItem}`} value={langItem}>
                        {langItem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.userId")}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} placeholder="eg: 47623" {...field} />
                </FormControl>
                <FormDescription>{t("developer.configCreator.userIdHelperText")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="qa"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(state) => field.onChange(typeof state === "boolean" ? state : false)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("developer.configCreator.useQaEnvironment")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dev"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(state) => field.onChange(typeof state === "boolean" ? state : false)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("developer.configCreator.onLoadOpenDevMenu")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </DevGroupCard>

        <DevGroupCard title={t("developer.configCreator.confirmationEmailSettings")}>
          <FormField
            control={form.control}
            name="emailTemplateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.responseTemplateId")}</FormLabel>
                <FormControl>
                  <Input type="number" min={0} placeholder="eg: 674257" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stopEmailGlobalDocuments"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(state) => field.onChange(typeof state === "boolean" ? state : false)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("developer.configCreator.disableGlobalDocumentsForConfirmationEmail")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stopAttachingDriverLicenseFiles"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(state) => field.onChange(typeof state === "boolean" ? state : false)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("developer.configCreator.disableLicenseAttachmentsForConfirmationEmail")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </DevGroupCard>

        <DevGroupCard title={t("developer.configCreator.applicationFlowSettings")}>
          <FormField
            control={form.control}
            name="flow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.applicationFlows")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    handleSelectFlowItem(value, field.value);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("developer.configCreator.formSelectValue")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_SCREEN_FLOWS.map((flowItem) => (
                      <SelectItem key={`dev-select-flow-${flowItem.value}`} value={flowItem.value}>
                        {flowItem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                <div>
                  <ol className="ml-6 mt-3 list-decimal text-sm">
                    {field.value.map((flowItem, index) => (
                      <li key={`dev-flow-item-${flowItem}-${index}`}>
                        <div className="my-1 flex items-center gap-3 rounded bg-primary-foreground px-2 py-2 align-middle">
                          <button
                            type="button"
                            onClick={() => handleRemoveFlowItem(index, field.value)}
                            className="flex aspect-square h-5 justify-center rounded-full bg-destructive align-middle text-sm text-destructive-foreground"
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="successSubmissionScreen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.applicationSuccessScreen")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("developer.configCreator.applicationSuccessScreen")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALL_SUCCESS_SCREENS.map((successScreen) => (
                      <SelectItem
                        key={`dev-select-successSubmissionScreen-${successScreen.value}`}
                        value={successScreen.value}
                      >
                        {successScreen.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showPreSubmitSummary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(state) => field.onChange(typeof state === "boolean" ? state : false)}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("developer.configCreator.showPreSubmitSummary")}</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </DevGroupCard>

        <div className="flex w-full gap-2">
          <Button type="submit">{t("developer.configCreator.btnSave")}</Button>
          <Button type="reset" color="primary" variant="secondary">
            {t("developer.configCreator.btnReset")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const DevGroupCard = ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => {
  return (
    <div className="rounded border border-muted px-4 py-4">
      <span className="select-none text-base font-semibold text-primary">{title}</span>
      <div className="mt-4 flex flex-col space-y-4 px-1">{children}</div>
    </div>
  );
};

export default DeveloperDebugMenu;
