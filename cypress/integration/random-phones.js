/// <reference types="cypress" />

// Lodash library is bundled with Cypress
const { _ } = Cypress;

it('random phone', () => {
  cy.visit('/');

  const username = `test-${_.random(1e4)}`;
  const email = `${username}@example.com`;

  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.contains('button', 'Sign up').click();

  // pick a random phone number that starts with the
  // give prefix by adding two random digits to it.
  const testNumberPrefix = '555-909-09';
  // using _.random with _.padStart to make sure
  // any shorter number is padded with leading zeroes
  const phoneNumber = testNumberPrefix + _.padStart(_.random(0, 100), 2, '0');
  cy.get('[name=phone]').type(`${phoneNumber}{enter}`, { delay: 75 });

  // when using the special phone number above
  // we can validate it using this code
  cy.get('[name=code]').type('4467', { delay: 75 });
  cy.get('button').click();
  cy.get('[data-cy=PhoneVerified]').should('be.visible');
});
