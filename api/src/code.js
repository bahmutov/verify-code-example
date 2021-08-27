// @ts-check
const { makeConnection } = require('./db.config.js');
const { json } = require('micro');

module.exports = async function (req, res) {
  const { userId, phoneNumber, code } = await json(req);
  if (!userId || !phoneNumber || !code) {
    throw new Error('Missing parameters');
  }
  console.log('verifying for user %d: phone %s code %s', userId, phoneNumber, code);

  const connection = makeConnection();

  // look up the code verification from the database
  const expected = await new Promise((resolve, reject) => {
    connection.query(
      {
        sql: 'SELECT phone,phoneConfirmationCode FROM users WHERE user_id = ?',
        values: [userId]
      },
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject(error);
        }
        const expected = results[0];
        console.log(
          'user %s expected phone %s confirmation %s',
          userId,
          expected.phone,
          expected.phoneConfirmationCode
        );
        resolve({
          phone: expected.phone,
          phoneConfirmationCode: expected.phoneConfirmationCode
        });
      }
    );
  });

  if (expected.phone !== phoneNumber) {
    const error = 'Phone number does not match';
    console.error(`Error: ${error}`);
    connection.end();
    return {
      error
    };
  }

  if (expected.phoneConfirmationCode !== code) {
    const error = 'Wrong confirmation code';
    console.error(`Error: ${error}`);
    connection.end();
    return {
      error
    };
  }

  // update the user - the phone number is confirmed
  await new Promise((resolve, reject) => {
    connection.query(
      {
        sql:
          'UPDATE users SET isPhoneVerified = true, phoneConfirmationCode = NULL WHERE user_id = ?',
        values: [userId]
      },
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject(error);
        }
        console.log('confirmed phone number %s for user %d', phoneNumber, userId);
        resolve();
      }
    );
  });

  return {};
};
