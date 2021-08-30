/// <reference types="cypress" />

// Lodash library is bundled with Cypress
const { _ } = Cypress;

export const getTestPhoneNumber = () => {
  // pick a random phone number that starts with the
  // give prefix by adding two random digits to it.
  const testNumberPrefix = '555-909-09';
  // using _.random with _.padStart to make sure
  // any shorter number is padded with leading zeroes
  const phoneNumber = testNumberPrefix + _.padStart(_.random(0, 100), 2, '0');
  return phoneNumber;
};
