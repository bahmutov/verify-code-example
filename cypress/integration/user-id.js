/// <reference types="cypress" />

// Lodash library is bundled with Cypress
const { _ } = Cypress;

it('returns user id', () => {
  cy.visit('/');

  const username = `test-${_.random(1e4)}`;
  const email = `${username}@example.com`;

  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.intercept('/signup.json').as('signup');
  cy.contains('button', 'Sign up').click();
  cy.wait('@signup')
    .its('response.body')
    // the assertion "have.property" yields its value
    .should('have.property', 'userId')
    .then((userId) => {
      console.log('New user id %s', userId);

      cy.task('getUser', userId);
    });
});
