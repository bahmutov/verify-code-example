# Database API

This server responds to HTTP requests and connects to the MySQL database to insert, update, and fetch records. See the top level routing in the [index.js](./index.js) file (served using [micro](https://github.com/vercel/micro#readme) or [micro-dev](https://github.com/vercel/micro-dev))

The database connection requires an `.env` file with the following environment variables

```
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

I used a free MySQL hosting from [https://www.freesqldatabase.com/](https://www.freesqldatabase.com/) to make a small database with the `users` table.

## Users table

The table was created using the following SQL statement.

```sql
CREATE TABLE users(
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(40) NOT NULL,
    phone VARCHAR(20),
    phoneConfirmationCode VARCHAR(10),
    isPhoneVerified BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(user_id)
);
```

Connection to the MySQL database through the NPM module [mysql](https://github.com/mysqljs/mysql) installed as a production dependency in the [package.json](./package.json) file in this folder. See the source code in the [src/db.config.js](./src/db.config.js) file.

## Run

```shell
$ npm install
$ npm start
# or in the dev mode
$ npm run dev
```

The API responds at port 4343.

## Routes

- new users sign up via [src/signup.js](./src/signup.js)
- the user sets their phone which adds a confirmation code via [src/phone.js](./src/phone.js)
- the user can confirm the phone number via route [src/code.js](./src/code.js)
