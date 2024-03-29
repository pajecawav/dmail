# dmail

`dmail` is a disposable mail server.

## Supported Providers

-   [ Sendgrid ](https://sendgrid.com/)
-   [ Mailchimp ](https://mailchimp.com/)
-   [Sendinblue](https://sendinblue.com) ([docs](https://developers.sendinblue.com/docs/inbound-parsing-api-1))

## Install

### Manually

Clone the repo:

```sh
git clone https://github.com/pajecawav/dmail.git
cd dmail
```

Create `.env` file (you can use `.env.example` for reference).

Install dependencies and build app:

```
yarn install
yarn build
```

Start the server:

```sh
yarn start
```

### Using Docker

Pull Docker image:

```sh
docker pull ghcr.io/pajecawav/dmail
```

Create `.env` file (you can use `.env.example` for reference).

Start Docker container:

```sh
docker run \
    -p 3000:3000 \
    --env-file .env \
    --name dmail \
    ghcr.io/pajecawav/dmail

```

## Development

Start development server:

```sh
yarn dev
```

Navigate to http://localhost:3000

## Web Extension

Build extension:

```sh
yarn build-extension
```

Start extension (opens browser):

```sh
yarn start-extension
```

Bundle extension into a `zip` file:

```sh
yarn bundle-extension
```
