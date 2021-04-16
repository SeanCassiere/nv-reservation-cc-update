# Navotar Adding Credit Card Details for a Reservation

To be able to add card details to a reservation.

URL Params

```
?reservationId=xxxxx&clientId=xxxx&lang=en
```

## Confirmation Emails

I've set up a Netlify Serverless function to handle the sending of confirmation emails after the Credit Card details have been inserted.

The Endpoint (GET) is `/api/sendConfirmationEmail` with the following params.
| Param | Value |
| --- | ---|
| customerEmail | The email address of the customer |
| reservationNo | The reservation number through which the credit card details were entered |
| locationEmail | The email address associated with the checkout location |

## Language Support

Languages currently supported
| Language | Code |
| --- | --- |
| English | en |
| French | fr |
| German | de |
| Spanish | es |
