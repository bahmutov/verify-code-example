// @ts-check
/// <reference types="cypress" />
const mysql = require('../../api/node_modules/mysql');

module.exports = function (on, config) {
  // this function runs in Node at the start of the project
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;
  const password = process.env.DB_PASSWORD;
  if (!host || !user || !database || !password) {
    throw new Error('DB variables are not set');
  }

  on('task', {
    async getUser(id) {
      const connection = mysql.createConnection({
        host,
        user,
        password,
        database
      });

      connection.connect();

      const theUser = await new Promise((resolve, reject) => {
        connection.query(
          {
            sql: 'SELECT * FROM users WHERE user_id = ?',
            values: [id]
          },
          function (error, results, fields) {
            if (error) {
              console.error(error);
              return reject(error);
            }

            if (!results.length) {
              console.error('Could not find user with username %s', id);
              return reject(new Error(`Unknown user ${id}`));
            }

            console.log(results);
            // return all fields except for ID
            // also convert the isPhoneVerified to boolean
            resolve({
              ...results[0],
              isPhoneVerified: results[0].isPhoneVerified === 1,
              user_id: undefined
            });
          }
        );
      });

      connection.end();

      return theUser;
    }
  });
};
