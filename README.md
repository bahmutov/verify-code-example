# verify-code-example

> Example web application with MySQL database to verify the user phone number

## Install

```bash
$ npm install
# should install the web application dependencies
# then switch to the "api" folder and install its dependencies
# if this does not happen, run yourself:
$ cd api
$ npm install
```

## Start

You can start the API and the web application using two terminals:

```bash
# starts the web application
$ npm run dev
# from another terminal start the API
$ npm run dev:api
```

**Note:** to connect to the database, the API requires certain environment variable or `.env` file, see the [API README](./api/README.md).

Then from the third terminal open Cypress

```bash
$ npm run cy:open
```

### Start all

Alternatively, you can start the application, the api, and open Cypress using a single command that uses [start-server-and-test](https://github.com/bahmutov/start-server-and-test) utility.

```bash
$ npm run cy
```

If everything starts correctly, you should see Cypress Desktop GUI window.

![The app, api, and Cypress started](./images/cy.png)
