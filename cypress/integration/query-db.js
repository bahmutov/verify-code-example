/// <reference types="cypress" />

import { getTestPhoneNumber } from './utils';

// Lodash library is bundled with Cypress
const { _ } = Cypress;

it('queries code from DB', () => {
  cy.visit('/');

  const username = `test-${_.random(1e4)}`;
  const email = `${username}@example.com`;
  // we will find the user id later
  let userId;

  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.intercept('/signup.json').as('signup');
  cy.contains('button', 'Sign up').click();
  cy.wait('@signup')
    .its('response.body')
    // the assertion "have.property" yields its value
    .should('have.property', 'userId')
    .then((id) => {
      userId = id;
    });

  const phoneNumber = getTestPhoneNumber();
  cy.get('[name=phone]').type(`${phoneNumber}{enter}`, { delay: 75 });
  cy.get('[name=code]')
    .should('be.visible')
    .then(() => {
      // now we can query the database to find out the confirmation code
      // need to use .then closure to make sure the userId is defined
      cy.task('getUser', userId)
        .should('have.property', 'phoneConfirmationCode')
        .then((code) => {
          cy.log(`code: **${code}**`);
          cy.get('[name=code]').type(code + '{enter}', { delay: 75 });
        });
    });

  // at the end of all the previous commands
  // the phone number should have been verified
  cy.get('[data-cy=PhoneVerified]').should('be.visible');
});
