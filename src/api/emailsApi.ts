import { ConfirmationEmailStoreType } from "../hooks/stores/useRuntimeStore";
import { createBodyForEmail, CreateBodyForEmail } from "../utils/bodyEmailTemplate";
import clientV3, { clientFetch } from "./clientV3";

type ComposeTemplateArrayItem = {
  clientId: number;
  contentId: number | null;
  description: string | null;
  isCheckin: boolean;
  isCheckOut: boolean;
  isPdfAttached: boolean;
  status: number;
  subjectLine: string;
  templateId: number;
  templateName: string;
  templateTypeName: string;
  templateURL: string | null;
  templateTypeId: number;
};

type GetComposeDetails = {
  mailName: string;
  fromAddress: string;
  toAddress: string;
  ccAddresses: string;
  emailTemplateList: ComposeTemplateArrayItem[];
};

export interface ReturnComposeEmailDetails extends GetComposeDetails {
  ccEmails: string[];
  selectedTemplate: ComposeTemplateArrayItem | null;
}

export const getComposeEmailDetails = async (
  clientId: any,
  userId: any,
  referenceType: string,
  referenceId: any,
  responseTemplateId: any
): Promise<ReturnComposeEmailDetails | null> => {
  let apiResponseDetails: GetComposeDetails | null = null;
  let composeEmailDetails: ReturnComposeEmailDetails | null = null;

  try {
    const response = await clientV3.get(`/Emails/ComposeEmail`, {
      params: {
        clientId,
        userId,
        referenceType,
        referenceId,
      },
    });

    if (response.status === 200) {
      apiResponseDetails = response.data;
    }
  } catch (error) {
    console.log("Warn: could not fetch compose email details", error);
  }

  if (!apiResponseDetails) {
    return null;
  }

  const ccEmails = apiResponseDetails.ccAddresses.split(",");
  const selectedTemplate =
    apiResponseDetails.emailTemplateList.find((template) => `${template.templateId}` === `${responseTemplateId}`) ||
    null;

  composeEmailDetails = {
    ...apiResponseDetails,
    ccEmails,
    selectedTemplate,
  };

  return composeEmailDetails;
};

export async function fetchEmailTemplate(opts: {
  clientId: string;
  templateId: string;
}): Promise<{ templateTypeId: number } | null> {
  const params = new URLSearchParams();
  params.append("clientId", opts.clientId);
  try {
    const { templateTypeId } = await clientFetch(`/Emails/${opts.templateId}/EmailTemplate?` + params).then((r) =>
      r.json()
    );
    return {
      templateTypeId,
    };
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
}) {
  let apiResponseDetails: GetComposeDetails | null = null;
  let composeEmailDetails: ReturnComposeEmailDetails | null = null;

  try {
    const params = new URLSearchParams();
    params.append("clientId", opts.clientId);
    params.append("userId", opts.adminUserId.toString());
    params.append("referenceType", opts.referenceType);
    params.append("referenceId", opts.referenceId);

    const res = await clientFetch("/Emails/ComposeEmail?" + params).then((r) => r.json());
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
    return await clientFetch("/Emails/PreviewTemplate", {
      method: "POST",
      body: JSON.stringify(createBodyForEmail(opts)),
    }).then((r) => r.text());
  } catch (error) {
    return null;
  }
}

interface PostConfirmationEmailProps extends CreateBodyForEmail {
  dataUrl: string;
}

export async function postConfirmationEmail(opts: PostConfirmationEmailProps) {
  if (!opts.dataUrl) return null;
  const dataUrl = opts.dataUrl;
  const emailBodyHtml = await fetch(dataUrl).then((r) => r.text());

  await clientFetch("/Emails", {
    method: "POST",
    body: JSON.stringify(createBodyForEmail({ ...opts, emailBody: emailBodyHtml })),
  });
  URL.revokeObjectURL(dataUrl);
  return true;
}
