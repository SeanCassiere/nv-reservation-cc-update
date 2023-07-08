import React from "react";
import { useTranslation } from "react-i18next";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { useClipboard } from "@/hooks/logic/useClipboard";
import { useConfigStore } from "@/hooks/stores/useConfigStore";
import { useRuntimeStore } from "@/hooks/stores/useRuntimeStore";

import { supportedLanguages } from "@/i18n";
import { isValueTrue } from "@/utils/common";
import { cn, setHtmlDocumentColorScheme } from "@/utils";
import { ALL_SCREEN_FLOWS, ALL_SUCCESS_SCREENS, APP_CONSTANTS, REPO_URL } from "@/utils/constants";

import { configObjectFormSchema, ConfigObjectFormValues, makeUrlQueryFromConfigObject } from "./utils";

const DeveloperDebugMenu: React.FC<{ open: boolean; handleClose: () => void }> = ({ open, handleClose }) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="left" className="overflow-y-scroll">
        <SheetHeader className="mb-4">
          <SheetTitle>{t("developer.drawerTitle")}</SheetTitle>
          <SheetDescription>
            <a href={REPO_URL} rel="noreferrer" target="_blank">
              {t("developer.viewProjectRepo")}
            </a>
          </SheetDescription>
        </SheetHeader>
        <ConfigCreator />
      </SheetContent>
    </Sheet>
  );
};

const ConfigCreator = () => {
  const { t, i18n } = useTranslation();

  const rs = useRuntimeStore();
  const cs = useConfigStore();

  const queryParams = new URLSearchParams(cs.rawQueryString);
  const queryDev = queryParams.get("dev");

  const [isCopied, copy] = useClipboard({
    successDuration: 1250,
  });

  const form = useForm<ConfigObjectFormValues>({
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
      flow: cs.flow.map((item) => ({ value: item })),
      showPreSubmitSummary: cs.showPreSubmitSummary,
      successSubmissionScreen: cs.successSubmissionScreen,
      stopEmailGlobalDocuments: cs.disableGlobalDocumentsForConfirmationEmail,
      stopAttachingDriverLicenseFiles: cs.disableEmailAttachingDriverLicense,
      colorScheme: cs.colorScheme,
    },
  });
  const formValues = form.watch();

  const {
    fields: flowFields,
    append: appendFlowField,
    remove: removeFlowField,
  } = useFieldArray({
    control: form.control,
    name: "flow",
  });

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
              copy(window.location.origin + "/?" + newQueryString);
            }}
          >
            {isCopied ? "👍🏼 " : ""}
            {t("developer.configCreator.btnCopy", { context: isCopied ? "action" : "" })}
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
              <FormItem>
                <FormLabel>{t("developer.configCreator.referenceType")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("developer.configCreator.formSelectValue")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={APP_CONSTANTS.REF_TYPE_RESERVATION}>
                      {APP_CONSTANTS.REF_TYPE_RESERVATION}
                    </SelectItem>
                    <SelectItem value={APP_CONSTANTS.REF_TYPE_AGREEMENT}>{APP_CONSTANTS.REF_TYPE_AGREEMENT}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </DevGroupCard>

        <DevGroupCard title={t("developer.configCreator.generalApplicationConfiguration")}>
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
                    {supportedLanguages.sort(alphabeticalSortStrings).map((langItem) => (
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
            name="colorScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("developer.configCreator.colorScheme")}</FormLabel>
                <Select
                  onValueChange={(value) => {
                    setHtmlDocumentColorScheme(value);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("developer.configCreator.formSelectValue")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={APP_CONSTANTS.COLOR_SCHEME_DEFAULT_CLASS}>Default</SelectItem>
                    <SelectItem value={APP_CONSTANTS.COLOR_SCHEME_DARK_CLASS}>Dark</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    {ALL_SUCCESS_SCREENS.sort(alphabeticalSortObjects).map((successScreen) => (
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

          <div>
            {flowFields.map((fieldItem, index) => (
              <FormField
                control={form.control}
                key={fieldItem.id}
                name={`flow.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      {t("developer.configCreator.applicationFlows")}
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      {t("developer.configCreator.applicationFlowsDescription")}
                    </FormDescription>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("developer.configCreator.formSelectValue")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ALL_SCREEN_FLOWS.sort(alphabeticalSortObjects).map((screenFlow, idx) => (
                              <SelectItem key={`${index}-screen-opt-${idx}`} value={screenFlow.value}>
                                {screenFlow.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            removeFlowField(index);
                          }}
                          disabled={flowFields.length === 1}
                        >
                          &times;
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendFlowField({ value: ALL_SCREEN_FLOWS[0].value })}
            >
              Add screen
            </Button>
          </div>
        </DevGroupCard>

        <SheetFooter>
          <Button type="reset" variant="ghost">
            {t("developer.configCreator.btnReset")}
          </Button>
          <Button type="submit">{t("developer.configCreator.btnSave")}</Button>
        </SheetFooter>
      </form>
    </Form>
  );
};

function alphabeticalSortStrings(item1: string, item2: string) {
  if (item1 < item2) {
    return -1;
  }
  if (item1 > item2) {
    return 1;
  }
  return 0;
}

function alphabeticalSortObjects<T extends { value: string; label: string }>(item1: T, item2: T) {
  if (item1.value < item2.value) {
    return -1;
  }
  if (item1.value > item2.value) {
    return 1;
  }
  return 0;
}

const DevGroupCard = ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => {
  return (
    <div className="rounded border border-muted px-4 py-4">
      <span className="select-none text-base font-semibold text-primary">{title}</span>
      <div className="mt-4 flex flex-col space-y-4 px-1">{children}</div>
    </div>
  );
};

export default DeveloperDebugMenu;
