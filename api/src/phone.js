// @ts-check
const { makeConnection } = require('./db.config.js');
const { json } = require('micro');

module.exports = async function (req, res) {
  // should have userId, phoneNumber fields
  const { userId, phoneNumber } = await json(req);
  console.log('adding phone %s for user %d', phoneNumber, userId);

  let phoneConfirmationCode;
  const specialTestNumber = process.env.TEST_PHONE_NUMBER;
  if (specialTestNumber && phoneNumber === specialTestNumber) {
    // the test user! use the same code and do not send it
    // just store in the database
    phoneConfirmationCode = '4467';
  } else {
    // generate a random code, send it via SMS to the phone number
    phoneConfirmationCode = String(Math.random()).slice(2, 6);
  }

  const connection = makeConnection();

  // any existing user with the same phone number should
  // lose their phone verified status
  await new Promise((resolve, reject) => {
    connection.query(
      {
        sql:
          'UPDATE users SET phoneConfirmationCode = NULL, isPhoneVerified = false WHERE phone = ?',
        values: [phoneNumber]
      },
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject(error);
        }
        console.log('removed phone %s for any existing users', phoneNumber);
        resolve();
      }
    );
  });

  // save the random phone verification code
  // and "send" the phone verification code via SMS
  // (in this demo we are NOT sending the verification code via SMS)
  await new Promise((resolve, reject) => {
    connection.query(
      {
        sql: 'UPDATE users SET phone = ?, phoneConfirmationCode = ? WHERE user_id = ?',
        values: [phoneNumber, phoneConfirmationCode, userId]
      },
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject(error);
        }
        console.log('for user %s set phone %s', userId, phoneNumber);
        console.log(
          'HACK: the phone confirmation code with this phone is %s',
          phoneConfirmationCode
        );
        resolve();
      }
    );
  });

  connection.end();

  return {
    userId,
    phoneNumber
  };
};
