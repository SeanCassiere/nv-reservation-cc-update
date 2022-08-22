# RENTALL - Customer Details Update

This application is meant for usage a RENTALL/Navotar client's customer to be able to add additional details to their reservation or agreement.

## Set-up the application for development

1. Clone the repository.
2. Install dependencies `yarn install`.
3. Create a `.env` file and add the necessary `secrets` into it. You can use the `.env.example` file as a reference.
4. Run the development server using `yarn dev`.

## How does it work?

A custom URL pointed at the hosted application is added into the client account as a link in a email template sent to their customer.

Example: [https://nv-reservation-cc-details.netlify.app/?agreementId=640904&lang=en&config=eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo4Mzg4LCJmbG93IjpbIkRlZmF1bHQvUmVudGFsU2lnbmF0dXJlRm9ybSJdLCJmcm9tUmVudGFsbCI6dHJ1ZX0=](https://nv-reservation-cc-details.netlify.app/?agreementId=640904&lang=en&config=eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo4Mzg4LCJmbG93IjpbIkRlZmF1bHQvUmVudGFsU2lnbmF0dXJlRm9ybSJdLCJmcm9tUmVudGFsbCI6dHJ1ZX0=)

Once the customer accesses the application via the provided custom URL, they would then be able to add details requested by the client, directly against their booking.

## Developer information

The application authorizes itself via a proxy lambda function hosted on Netlify, which in-turn obtains its access token from the Navotar OAuth2 Authorization server using `client credentials`. Then it obtains and updates information into the client account using the RENTALL V3 API.

You can view the OpenAPI documentation via this [link](https://api.apprentall.com/docs).

### Controlling the application flow

The information being requested from the client is based on the flow setup within the config of the URL params.

To create your own config and flow, you can use the built-in developer menu. You can access this menu using the following keyboard shortcut.

Windows: `CTRL + SHIFT + K`

Mac: `CMD + SHIFT + K`

### URL params

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

### Language localization

These are the language codes supported by the application.
| Language | Code |
| --- | --- |
| English | en |
| French | fr |
| German | de |
| Spanish | es |

### Config params

Should you wish to manually create your own config string, you will need to create a JSON object using the shape defined below.

```json
{
  "clientId": 1013,
  "emailTemplateId": 7388,
  "flow": ["Default/CreditCardForm"],
  "fromRentall": true
}

// Example Base64 --> eyJjbGllbnRJZCI6IDEwMTMsImVtYWlsVGVtcGxhdGVJZCI6IDczODgsImZsb3ciOiBbIkRlZmF1bHQvQ3JlZGl0Q2FyZEZvcm0iXX0=
```

These are the parameters supported in the configuration object.

| Param                   | Type       | Value                                                                                                                                                                                                             |
| ----------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clientId                | **number** | RENTALL/Navotar Client ID of the client account.                                                                                                                                                                  |
| emailTemplateId         | **number** | Custom Email Template ID to be used when sending the confirmation email.<br /><br /> **_Important_**: Please note, that this email template must exist in the client's account.                                   |
| flow                    | string[]?  | Ordered array of the screens/views to be gone through. <br /><br /> **_Default_** `["Default/CreditCardForm"]`                                                                                                    |
| successSubmissionScreen | string?    | The key of the success screen to be shown to the user once the details have been successfully submitted <br /><br /> **_Default_** `"Default/SuccessSubmission"`                                                  |
| fromRentall             | boolean?   | Boolean value indicating if this user's primary account is RENTALL or Navotar. Based on this the link at the bottom of the page will be changed, along with the support email. <br /><br /> **_Default_** `false` |

Afterwards, you can encode this JSON object using Base64 to formulate the final URL-safe config string. [https://www.base64encode.org/](https://www.base64encode.org/)

### Available screens/views

| Key                                    | Description                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Default/CreditCardForm                 | The default credit card form                                                               |
| Default/LicenseUploadForm              | The default form for uploading driver's license images                                     |
| Default/CreditCardAndLicenseUploadForm | The a combination of both the `Default/CreditCardForm` and the `Default/LicenseUploadForm` |
| Default/RentalSignatureForm            | The default canvas to capture the customer's signature                                     |

### Available success screens

| Key                       | Description                                    |
| ------------------------- | ---------------------------------------------- |
| Default/SuccessSubmission | The default generic application success screen |
