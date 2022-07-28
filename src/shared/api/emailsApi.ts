import clientV3 from "./clientV3";

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
