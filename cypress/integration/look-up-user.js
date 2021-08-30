/// <reference types="cypress" />

import { getTestPhoneNumber } from './utils';

// Lodash library is bundled with Cypress
const { _ } = Cypress;

const getUserInfo = (username) =>
  // use the API url to request the user info
  // https://on.cypress.io/request
  cy.request(`http://localhost:4343/users/${username}`).its('body');

it('looks up the user via API call', () => {
  cy.visit('/');

  const username = `test-${_.random(1e4)}`;
  const email = `${username}@example.com`;

  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.contains('button', 'Sign up').click();
  // important: wait for the next page to load
  // to know for sure the API call has finished
  cy.get('[name=phone]').should('be.visible');

  // find the user information and confirm the user has
  // no phone and no confirmation code
  getUserInfo(username).should('deep.include', {
    username,
    email,
    phone: null,
    phoneConfirmationCode: null,
    isPhoneVerified: false
  });

  const phoneNumber = getTestPhoneNumber();
  cy.get('[name=phone]').type(`${phoneNumber}{enter}`, { delay: 75 });

  // the user should have the random code and phone number set
  getUserInfo(username)
    .should('deep.include', {
      username,
      email,
      phone: phoneNumber,
      isPhoneVerified: false
    })
    // confirm the code is a string of 4 digits
    .its('phoneConfirmationCode')
    .should('match', /^\d{4}$/)
    .then((code) => {
      // let's use the fetched code to verify the phone number
      cy.get('[name=code]').type(code, { delay: 75 });
      cy.get('button').click();
      cy.get('[data-cy=PhoneVerified]').should('be.visible');

      getUserInfo(username).should('deep.include', {
        username,
        email,
        phone: phoneNumber,
        isPhoneVerified: true,
        // phone confirmation code is reset to null
        phoneConfirmationCode: null
      });
    });
});
