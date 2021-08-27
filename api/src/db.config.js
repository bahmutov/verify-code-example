const mysql = require('mysql');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

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
