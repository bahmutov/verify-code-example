// @ts-check
/// <reference types="cypress" />
const { makeConnection } = require('../../api/src/db.config');

module.exports = function (on, config) {
  on('task', {
    async getUser(id) {
      const connection = makeConnection();

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
