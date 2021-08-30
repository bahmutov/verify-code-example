// @ts-check
const { makeConnection } = require('./db.config.js');
const match = require('micro-route/match');

// looks up the user by username and returns the basic info
module.exports = async function (req, res) {
  const { params } = match(req, '/users/:username');
  console.log('looking up user %s', params.username);

  const connection = makeConnection();

  const user = await new Promise((resolve, reject) => {
    connection.query(
      {
        sql: 'SELECT * FROM users WHERE username = ?',
        values: [params.username]
      },
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject(error);
        }

        if (!results.length) {
          console.error('Could not find user with username %s', params.username);
          return reject(new Error('Unknown user'));
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

  return user;
};
