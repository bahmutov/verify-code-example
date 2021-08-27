/// <reference types="cypress" />

// Lodash library is bundled with Cypress
const { _ } = Cypress;

it('shows an error message for wrong code', () => {
  cy.visit('/');

  const username = `test-${_.random(1e4)}`;
  const email = `${username}@example.com`;

  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.contains('button', 'Sign up').click();

  cy.get('[name=phone]').type('555-123-4060{enter}', { delay: 75 });

  // use a wrong code on purpose
  cy.get('[name=code]').type('0000', { delay: 75 });
  cy.get('button').click();
  cy.contains('.error-message', 'Wrong confirmation code').should('be.visible');
});
