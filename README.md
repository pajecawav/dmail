# dmail

`dmail` is a disposable mail server. It uses [Sendgrid](https://sendgrid.com/) API to receive and parse emails. Live demo available at https://mail.elif.pw or as a telegram bot [@dispmailbot](https://t.me/dispmailbot).

It uses [FastAPI](https://github.com/tiangolo/fastapi) for backend and [preact](https://github.com/preactjs/preact) for frontend. Also installable as a [PWA](https://web.dev/progressive-web-apps/).

# Installation

1.  Install [poetry](https://python-poetry.org/docs/#installation) and [npm](https://www.npmjs.com/get-npm)

1.  Clone project

    ```bash
    git clone https://github.com/pajecawav/dmail/
    ```

1.  `cd` into backend folder

    ```bash
    cd dmail/backend
    ```

1.  Install server dependencies (you can specify that you do not want the development dependencies installed with `--no-dev` option)

    ```bash
    poetry install
    ```

1.  Create `.env` file or use environment variables (see `.env.example` file for reference)

1.  Spawn shell within the virtual environment

    ```bash
    poetry shell
    ```

1.  Initialize database

    ```bash
    python -m dmail.scripts.init_db
    ```

1.  `cd` into frontend folder

    ```bash
    cd ../frontend
    ```

1.  Install frontend dependencies

    ```bash
    npm install
    ```

# Usage

1.  From `backend` folder spawn shell within the virtual environment and start [uvicorn](https://github.com/encode/uvicorn) server

    ```bash
    poetry shell
    uvicorn dmail.main:app
    ```

1.  From `frontend` folder start development server with `npm run dev`.

1.  Navigate to `http://localhost:8080`.

For deployment options consider using [nginx](https://nginx.org/ru/) to serve static assets (generated with `NODE_ENV=production npm run build`) and pass api requests to the backend.

# TODO

-   private addresses?
