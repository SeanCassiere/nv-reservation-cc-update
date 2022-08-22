# RENTALL - Customer Details Update

This application is meant for usage a RENTALL/Navotar client's customer to be able to add additional details to their reservation or agreement.

## How does it work?

A custom URL pointed at the hosted application is added into the client account as a link in an email template sent to their customer.

Example: [https://nv-reservation-cc-details.netlify.app/?agreementId=640904&lang=en&config=eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo4Mzg4LCJmbG93IjpbIkRlZmF1bHQvUmVudGFsU2lnbmF0dXJlRm9ybSJdLCJmcm9tUmVudGFsbCI6dHJ1ZX0=](https://nv-reservation-cc-details.netlify.app/?agreementId=640904&lang=en&config=eyJjbGllbnRJZCI6MTAxMywiZW1haWxUZW1wbGF0ZUlkIjo4Mzg4LCJmbG93IjpbIkRlZmF1bHQvUmVudGFsU2lnbmF0dXJlRm9ybSJdLCJmcm9tUmVudGFsbCI6dHJ1ZX0=)

Once the customer accesses the application via the provided custom URL, they would then be able to add details requested by the client, directly against their booking.

## Technologies used

This project uses React and is written in Typescript. The reason I (Sean) chose React and Typescript is that I am very comfortable with using the library and the language respectively.

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
2. Install dependencies `yarn install`.
3. Create a `.env` file and add the necessary `secrets` into it. You can use the `.env.example` file as a reference.
4. Run the development server using `yarn dev`.

## Authors

- [@SeanCassiere](https://github.com/SeanCassiere)
