# Navotar Reservation Details Update

This application is used to add additional details to their reservation.

Install `concurrently` globally before running `yarn dev`.

`npm install -g concurrently`

View the Navotar API V3 Documentation [API Documentation](https://api.appnavotar.com/api).

## URL Params

```
?reservationId=xxxxx&config=xxxx&lang=en
```

| Param         | Value                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------- |
| reservationId | This can be inserted using the Navotar email template.                                       |
| lang          | Supported languages codes, listed down below.                                                |
| config        | base64 encoding of a JSON string with certain bits of application configuration information. |

## Config params

When creating the base64 encoded JSON string, add in the following into the string.

```json
{
	"clientId": 1013,
	"emailTemplateId": 7388,
	"flow": ["Default/CreditCardForm"]
}

// Example Base64 --> eyJjbGllbnRJZCI6IDEwMTMsImVtYWlsVGVtcGxhdGVJZCI6IDczODgsImZsb3ciOiBbIkRlZmF1bHQvQ3JlZGl0Q2FyZEZvcm0iXX0=
```

| Param           | Value                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clientId        | Navotar Client ID of the User.                                                                                                                                                              |
| emailTemplateId | Navotar Client Custom Email Template ID of the User in the Reservation Confirmation Emails section.                                                                                         |
| flow            | Ordered array of the screens/views to be gone through. <br /><br /> This is an optional field. If not given in the config, only the **Default/CreditCardForm** will be shown to the user.   |
| fromRentall     | Boolean value indicating if this user's primary account is RENTALL or Navotar. <br /><br /> Based on this the link at the bottom of the page will be changed, along with the support email. |

## Available screens/views

| Key                                    | Description                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------ |
| Default/CreditCardForm                 | The default credit card form                                                               |
| Default/LicenseUploadForm              | The default form for uploading driver's license images                                     |
| Default/CreditCardAndLicenseUploadForm | The a combination of both the `Default/CreditCardForm` and the `Default/LicenseUploadForm` |

## Language Support

Languages currently supported
| Language | Code |
| --- | --- |
| English | en |
| French | fr |
| German | de |
| Spanish | es |
