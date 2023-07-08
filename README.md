# RENTALL - Customer Details Update

This application is meant for usage a RENTALL/Navotar client's customer to be able to add additional details to their reservation or agreement.

## How does it work?

A custom URL pointed at the hosted application is added into the client account as a link in an email template sent to their customer.

Example: [https://rentall-customer.pingstash.com/?agreementId=640904&lang=en&config=eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo4Mzg4LCJmbG93IjpbIkNyZWRpdENhcmRGb3JtIl19](https://rentall-customer.pingstash.com/?agreementId=640904&lang=en&config=eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo4Mzg4LCJmbG93IjpbIkNyZWRpdENhcmRGb3JtIl19)

Once the customer accesses the application via the provided custom URL, they would then be able to add details requested by the client, directly against their booking.

## Documentation

See [DOCUMENTATION](DOCUMENTATION.md) for information and configuration options for the application.

## Contributing

Contributions are always welcome!

See [CONTRIBUTION](CONTRIBUTION.md) for ways to get started.

Please adhere to this project's [CODE OF CONDUCT](CODE_OF_CONDUCT.md).

![Issues](https://img.shields.io/github/issues/SeanCassiere/nv-reservation-cc-update)
![Pull Requests](https://img.shields.io/github/issues-pr-closed/SeanCassiere/nv-reservation-cc-update)

## Development

1. Clone the repository.
2. Install dependencies `npm run install`.
3. Create a `.env` file and add the necessary `secrets` into it. You can use the `.env.example` file as a reference.
4. Run the development server using `npm run dev`.

## Authors

- [@SeanCassiere](https://github.com/SeanCassiere)
