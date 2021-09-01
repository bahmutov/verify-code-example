// @ts-check
const { makeConnection } = require('./db.config.js');
const { json } = require('micro');

module.exports = async function (req, res) {
  // should have userId, phoneNumber fields
  const { userId, phoneNumber } = await json(req);
  console.log('adding phone %s for user %d', phoneNumber, userId);

  let sendSms = true;
  // generate a random code, send it via SMS to the phone number
  let phoneConfirmationCode = String(Math.random()).slice(2, 6);

  if (process.env.TEST_PHONE_NUMBER && phoneNumber === process.env.TEST_PHONE_NUMBER) {
    // the test user! use the same code and do not send it
    // just store in the database
    phoneConfirmationCode = '4467';
    sendSms = false;
  } else if (
    process.env.TEST_PHONE_NUMBER_PREFIX &&
    phoneNumber.startsWith(process.env.TEST_PHONE_NUMBER_PREFIX)
  ) {
    // the test user that uses the phone number prefix
    // to allow multiple test phone numbers
    // NOTE: if we look up the code from the database,
    // this code could be truly random
    phoneConfirmationCode = '4467';
    sendSms = false;
  }

  const connection = makeConnection();

  // save the random phone verification code
  // and "send" the phone verification code via SMS
  // (in this demo we are NOT sending the verification code via SMS)
  await new Promise((resolve, reject) => {
    connection.query(
      {
        sql: `
          UPDATE users
          SET phone = ?, phoneConfirmationCode = ?, isPhoneVerified = false
          WHERE user_id = ?
        `,
        values: [phoneNumber, phoneConfirmationCode, userId]
      },
      function (error, results, fields) {
        if (error) {
          console.error(error);
          return reject(error);
        }
        console.log('for user %s set phone %s', userId, phoneNumber);
        console.log('The phone confirmation code with this phone is %s', phoneConfirmationCode);
        console.log('sending via SMS? %s', sendSms);
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
