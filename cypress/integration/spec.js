/// <reference types="cypress" />

it('fails with the wrong code', () => {
	cy.visit('/');
	cy.get('[name=username]').type('u');
	cy.get('[name=email]').type('e');
	cy.get('button').click();

	cy.get('[name=phone]').type('555-12-3456{enter}');

	cy.get('[name=code]').type('0000');
	cy.get('button').click();
	cy.contains('.error-message', 'Wrong confirmation code').should('be.visible');
});
