// Cypress E2E test example

describe('CareerCopilot Dashboard', () => {
  it('should load dashboard and display user info', () => {
    cy.visit('/dashboard');
    cy.contains('Dashboard');
    cy.get('[data-testid="user-info"]').should('exist');
  });
});
