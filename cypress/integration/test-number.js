/// <reference types="cypress" />

// Lodash library is bundled with Cypress
const { _ } = Cypress;

it('confirms the test phone number', () => {
  cy.visit('/');

  const username = `test-${_.random(1e4)}`;
  const email = `${username}@example.com`;

  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.contains('button', 'Sign up').click();

  cy.get('[name=phone]').type('555-909-0909{enter}', { delay: 75 });

  // when using the special phone number above
  // we can validate it using this code
  cy.get('[name=code]').type('4467', { delay: 75 });
  cy.get('button').click();
  cy.get('[data-cy=PhoneVerified]').should('be.visible');
});
