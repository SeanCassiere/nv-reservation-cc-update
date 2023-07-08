import { z } from "zod";

import { createBodyForEmail, type CreateBodyForEmail } from "@/utils/body-email-template";

import { clientFetch } from "./clientV3";

export type OneOffUploadAttachment = { fileName: string; blob: string; mimeType: string };

const composeTemplateArrayItemSchema = z.object({
  status: z.number(),
  subjectLine: z.string(),
  templateId: z.number(),
  templateName: z.string().nullable(),
  templateTypeName: z.string().nullable(),
  templateURL: z.string().nullable(),
  templateTypeId: z.number(),
});
type ComposeTemplateArrayItem = z.infer<typeof composeTemplateArrayItemSchema>;

const getComposeDetailsSchema = z.object({
  mailName: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  ccAddresses: z.string(),
  emailTemplateList: z.array(composeTemplateArrayItemSchema),
});
type GetComposeDetails = z.infer<typeof getComposeDetailsSchema>;

export interface ReturnComposeEmailDetails extends GetComposeDetails {
  ccEmails: string[];
  selectedTemplate: ComposeTemplateArrayItem | null;
}

const fetchEmailTemplateSchema = z.object({
  templateTypeId: z.number(),
});

export async function fetchEmailTemplate(opts: {
  clientId: string;
  templateId: string;
}): Promise<z.infer<typeof fetchEmailTemplateSchema> | null> {
  const params = new URLSearchParams();
  params.append("clientId", opts.clientId);
  try {
    const response = await clientFetch(`/api/v3/Emails/${opts.templateId}/EmailTemplate?` + params)
      .then((r) => r.json())
      .then((data) => fetchEmailTemplateSchema.parse(data));
    return response;
  } catch (error) {
    return null;
  }
}

export async function fetchComposeEmailDetails(opts: {
  clientId: string;
  adminUserId: number;
  referenceType: string;
  referenceId: string;
  responseTemplateId: string;
}): Promise<ReturnComposeEmailDetails | null> {
  let apiResponseDetails: GetComposeDetails | null = null;
  let composeEmailDetails: ReturnComposeEmailDetails | null = null;

  try {
    const params = new URLSearchParams();
    params.append("clientId", opts.clientId);
    params.append("userId", opts.adminUserId.toString());
    params.append("referenceType", opts.referenceType);
    params.append("referenceId", opts.referenceId);

    const res = await clientFetch("/api/v3/Emails/ComposeEmail?" + params)
      .then((r) => r.json())
      .then((data) => getComposeDetailsSchema.parse(data));
    apiResponseDetails = res;
  } catch (error) {
    return null;
  }

  if (!apiResponseDetails) {
    return null;
  }

  const ccEmails = apiResponseDetails.ccAddresses.split(",");
  const templateList = apiResponseDetails.emailTemplateList;

  const selectedTemplate = templateList.find((t) => t.templateId === Number(opts.responseTemplateId));
  composeEmailDetails = {
    ...apiResponseDetails,
    ccEmails: ccEmails.filter((e) => e !== ""),
    selectedTemplate: selectedTemplate ?? null,
  };

  return composeEmailDetails;
}

export async function fetchEmailTemplateHtml(opts: CreateBodyForEmail) {
  try {
    return await clientFetch("/api/v3/Emails/PreviewTemplate", {
      method: "POST",
      body: JSON.stringify(createBodyForEmail(opts)),
    }).then((r) => r.text());
  } catch (error) {
    return null;
  }
}

interface PostConfirmationEmailProps extends CreateBodyForEmail {
  dataUrl: string;
  globalDocuments: GlobalDocumentForEmail[];
  attachments: OneOffUploadAttachment[];
}

export async function postConfirmationEmail(opts: PostConfirmationEmailProps) {
  if (!opts.dataUrl) return null;
  const dataUrl = opts.dataUrl;
  const emailBodyHtml = await fetch(dataUrl).then((r) => r.text());

  await clientFetch("/api/v3/Emails", {
    method: "POST",
    body: JSON.stringify(
      createBodyForEmail({
        ...opts,
        emailBody: emailBodyHtml,
        globalDocuments: opts.globalDocuments,
        oneOffAttachments: opts.attachments,
      })
    ),
  });
  URL.revokeObjectURL(dataUrl);
  return true;
}

const globalDocumentForEmailSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  checked: z.boolean(),
  folderPath: z.string().nullable(),
  newFileName: z.string().nullable(),
  licenseNo: z.string().nullable(),
});
export type GlobalDocumentForEmail = z.infer<typeof globalDocumentForEmailSchema>;

export async function fetchGlobalDocumentsForEmailTemplate(opts: {
  clientId: string | number;
  templateId: string | number;
  templateTypeId: string | number;
}) {
  const params = new URLSearchParams();
  params.append("ClientId", `${opts.clientId}`);
  params.append("TemplateTypeId", `${opts.templateTypeId}`);
  params.append("TemplateId", `${opts.templateId}`);
  return await clientFetch("/api/v3/Emails/AttachmentForComposeEmail?" + params.toString())
    .then((r) => r.json())
    .then((data) => z.array(globalDocumentForEmailSchema).parse(data ?? []));
}
