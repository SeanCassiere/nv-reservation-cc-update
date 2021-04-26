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

```
{
	"clientId": 1013,
	"emailTemplateId": 7388
}

// Example Base64 --> ewoJImNsaWVudElkIjogMTAxMywKCSJlbWFpbFRlbXBsYXRlSWQiOiA3Mzg4Cn0=
```

| Param           | Value                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------- |
| clientId        | Navotar Client ID of the User                                                                       |
| emailTemplateId | Navotar Client Custom Email Template ID of the User in the Reservation Confirmation Emails section. |

## Language Support

Languages currently supported
| Language | Code |
| --- | --- |
| English | en |
| French | fr |
| German | de |
| Spanish | es |
