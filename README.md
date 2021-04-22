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
"clientId": 1013
}

// Example Base64 --> ewoiY2xpZW50SWQiOiAxMDEzCn0=
```

| Param    | Value                         |
| -------- | ----------------------------- |
| clientId | Navotar Client ID of the User |

## Language Support

Languages currently supported
| Language | Code |
| --- | --- |
| English | en |
| French | fr |
| German | de |
| Spanish | es |

# Deprecating following Netlify Cloud Function

## Confirmation Emails

I've set up a Netlify Serverless function to handle the sending of confirmation emails after the Credit Card details have been inserted.

The Endpoint (GET) is `/api/sendConfirmationEmail` with the following params.
| Param | Value |
| --- | ---|
| customerEmail | The email address of the customer |
| reservationNo | The reservation number through which the credit card details were entered |
| locationEmail | The email address associated with the checkout location |
