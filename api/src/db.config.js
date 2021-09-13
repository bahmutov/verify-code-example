const mysql = require('mysql');

// read the environment variables defined on the host machine
// Node.js allows one to look up all variables defined in the environment
// and then access them using process.env.<VARIABLE_NAME>
// https://nodejs.org/api/process.html#process_process_env

// in our system we assume that the database is running
// at the host URL "DB_HOST", and we can connect to it using
// "DB_USER", "DB_PASSWORD" environment values
// The database name comes from the "DB_NAME" variable.
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

// if the config variables are not set
// throw an error and stop the application
if (!host || !user || !database || !password) {
  throw new Error('DB variables are not set');
}
console.log('using db "%s" at "%s"', database, host);

const makeConnection = () => {
  const connection = mysql.createConnection({
    host,
    user,
    password,
    database
  });

  connection.connect();

  return connection;
};

module.exports = { makeConnection };
