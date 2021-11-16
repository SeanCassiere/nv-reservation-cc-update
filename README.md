# Navotar Adding Credit Card Details for a Reservation

To be able to add card details to a reservation.

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

| Param           | Value                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clientId        | Navotar Client ID of the User.                                                                                                                                                            |
| emailTemplateId | Navotar Client Custom Email Template ID of the User in the Reservation Confirmation Emails section.                                                                                       |
| flow            | Ordered array of the screens/views to be gone through. <br /><br /> This is an optional field. If not given in the config, only the **Default/CreditCardForm** will be shown to the user. |

## Available screens/views

| Key                    | Description                  |
| ---------------------- | ---------------------------- |
| Default/CreditCardForm | The default credit card form |

## Language Support

Languages currently supported
| Language | Code |
| --- | --- |
| English | en |
| French | fr |
| German | de |
| Spanish | es |
