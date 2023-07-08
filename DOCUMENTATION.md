# DOCUMENTATION

The application authorizes itself via a proxy lambda function hosted on Netlify, which in-turn obtains its access token from the Navotar OAuth2 Authorization server using `client_credentials`. Then it obtains and updates information into the client account using the RENTALL V3 API.

You can view the OpenAPI documentation via this [link](https://api.apprentall.com/docs).

## Controlling the application flow

The information being requested from the client is based on the flow setup within the config of the URL params.

To create your own config and flow, you can use the built-in developer menu. You can access this menu using the following keyboard shortcut.

Windows: `CTRL + SHIFT + K`

Mac: `CMD + SHIFT + K`

## URL params

The URL search params are used to easily provide/pass the configuration settings required to correctly initiate and authorize the application.

```
?reservationId=xxxxx&config=xxxx&lang=en
```

| Param         | Required | Value                                                                                        |
| ------------- | -------- | -------------------------------------------------------------------------------------------- |
| reservationId | false\*  | Reservation number or ID.                                                                    |
| agreementId   | false\*  | Agreement number or ID.                                                                      |
| lang          | false    | One of supported languages codes, listed down below.                                         |
| config        | true     | base64 encoding of a JSON string with certain bits of application configuration information. |

**NOTE:** Either the `reservationId` or `agreementId` must be passed into the URL params.

**NOTE:** If both the `reservationId` and `agreementId` are present in the URL params, it will default to proceed into a **Reservation** based flow, thereby disregarding any **Agreement** related queries or mutations.

## Language localization

These are the language codes supported by the application.
| Language | Code |
| --- | --- |
| English | en |
| English (Great Britain) | en-GB |
| French | fr |
| German | de |
| Spanish | es |
| Arabic | ar |
| Russian | ru |

`LTR` and `RTL` support is available and is applied automatically based on selected the language's requirements.

## Config params

Should you wish to manually create your own config string, you will need to create a JSON object using the shape defined below.

```json
{
  "clientId": 1013,
  "emailTemplateId": 7388,
  "flow": ["CreditCardForm"]
}

// Example Base64 --> eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo3Mzg4LCJmbG93IjpbIkRlZmF1bHQvQ3JlZGl0Q2FyZEZvcm0iXSwiZnJvbVJlbnRhbGwiOnRydWV9
```

These are the parameters supported in the configuration object.

| Param                           | Type       | Value                                                                                                                                                                                                                                                            |
| ------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clientId                        | **number** | RENTALL/Navotar Client ID of the client account.                                                                                                                                                                                                                 |
| emailTemplateId                 | **number** | Custom Email Template ID to be used when sending the confirmation email.<br /> **_Important_**: Please note, that this email template must exist in the client's account. The value of `0` can be used if you want to opt-out of sending the confirmation email. |
| userId                          | number?    | Existing RENTALL/Navotar User ID to be used when accessing information from the API.<br /> **_Important_**: Please note, that this user's ID must have the necessary privileges in their account. <br /><br /> **_Default_** `0`                                 |
| flow                            | string[]   | Ordered array of the screens/views to be gone through. <br />See all the [available flow screens](#available-flow-screens). <br /><br /> **_Default_** `["CreditCardForm"]`                                                                                      |
| environment                     | string?    | The environment to be used when accessing the API. <br />Supported values are: `"liquidweb-prod-1"` and `"liquidweb-qa-1"` <br /><br /> **_Default_** `"liquidweb-prod-1"`                                                                                       |
| successSubmissionScreen         | string?    | The key of the success screen to be shown to the user once the details have been successfully submitted. <br />See all the [available success screens](#available-success-screens). <br /><br /> **_Default_** `"SuccessSubmission"`                             |
| showPreSubmitSummary            | boolean?   | Boolean value indicating whether a screen is shown to the user prior to submission allowing them to go back and edit their entered details. <br /><br /> **_Default_** `false`                                                                                   |
| stopEmailGlobalDocuments        | boolean?   | Boolean value, when if `true`, it will prevent attaching any configured global documents for the confirmation email template. <br /><br /> **_Default_** `false`                                                                                                 |
| stopAttachingDriverLicenseFiles | boolean?   | Boolean value, when if `true`, it will prevent attaching the uploaded driver's license images in the confirmation email. <br /><br /> **_Default_** `false`                                                                                                      |
| colorScheme                     | string?    | The class name that shall be applied to the `html` tag to use a customized color scheme. <br />Supported values are: `""` and `"dark"`. <br /><br /> **_Default_** `""`                                                                                          |

Afterwards, you can encode this JSON object using Base64 to formulate the final URL-safe config string. [https://www.base64encode.org/](https://www.base64encode.org/)

## Available flow screens

| Key                            | Description                                                                                                                |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| CreditCardForm                 | The default credit card form                                                                                               |
| LicenseUploadForm              | The default form for uploading driver's license images                                                                     |
| CreditCardAndLicenseUploadForm | The a combination of both the `CreditCardForm` and the `LicenseUploadForm`                                                 |
| RentalSignatureForm            | The default canvas to capture the customer's signature                                                                     |
| RentalSummaryForm              | The default screen showing the rental's summary of charges needing the customer to view it before submitting their details |

## Available success screens

| Key                                           | Description                                                                                                                                                                                  |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SuccessSubmission                             | The default generic application success screen                                                                                                                                               |
| SuccessRentalChargesSummary                   | Application success screen with the same message shown in the _SuccessSubmission_ screen, as well as the summary of charges table shown in the _RentalSummaryForm_ screen.                   |
| SuccessSubmittedFormsSummary                  | Application success screen with a message similar to the _PreSubmission_ screen (changed for the submitted context), as well as a summary of the submitted form data.                        |
| SuccessSubmittedFormsWithRentalChargesSummary | Application success screen with a message similar to the _PreSubmission_ screen (changed for the submitted context), as well as a summary of the submitted form data and the rental charges. |
