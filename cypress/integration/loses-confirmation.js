/// <reference types="cypress" />

import { getTestPhoneNumber, getUserInfo } from './utils';

// Lodash library is bundled with Cypress
const { _ } = Cypress;

const signup = (username, email, phoneNumber) => {
  cy.visit('/');
  cy.get('[name=username]').type(username);
  cy.get('[name=email]').type(email);
  cy.contains('button', 'Sign up').click();
  cy.get('[name=phone]').type(`${phoneNumber}{enter}`, { delay: 75 });
  cy.get('[name=code]').type('4467', { delay: 75 });
  cy.get('button').click();
  cy.get('[data-cy=PhoneVerified]').should('be.visible');
};

it('loses phone confirmation', () => {
  const firstUser = `test-first-${_.random(1e4)}`;
  const firstEmail = `${firstUser}@example.com`;

  const secondUser = `test-second-${_.random(1e4)}`;
  const secondEmail = `${secondUser}@example.com`;

  const phoneNumber = getTestPhoneNumber();

  cy.log('**first user**');
  signup(firstUser, firstEmail, phoneNumber);
  getUserInfo(firstUser).should('deep.include', {
    phone: phoneNumber,
    isPhoneVerified: true
  });
  cy.log('**second user**');
  signup(secondUser, secondEmail, phoneNumber);
  getUserInfo(secondUser).should('deep.include', {
    phone: phoneNumber,
    isPhoneVerified: true
  });
  // the first user no longer has verified phone number
  getUserInfo(firstUser).should('deep.include', {
    phone: phoneNumber,
    isPhoneVerified: false
  });
});
