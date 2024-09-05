describe('Authentication Test', () => {
  beforeEach(() => {
    cy.intercept("POST", Cypress.env('api_server') + "/auth/login").as('submitCredentials')
  })

  it('allows to login', () => {
    cy.visit('/u/login')

    cy.get('[data-cy="email"]').children()
      .type(Cypress.env('user_email'))
    cy.get('[data-cy="password"]').children()
      .type(Cypress.env('user_password'))

    cy.get('[data-cy="submit"]').click()
    cy.wait('@submitCredentials')

    cy.url().should("be.equals", "http://localhost:8100/pages/home")
  })

  it('allows to visit homepage when logged-in', () => {
    cy.login(Cypress.env('user_email'), Cypress.env('user_password'));
    cy.visit('/pages/home');

    cy.url().should("be.equals", "http://localhost:8100/pages/home")
  })

  it('fails to login when credentials are incorrect', () => {
    cy.visit('/u/login')

    cy.get('[data-cy="email"]').children()
      .type('incorect@email.com')
    cy.get('[data-cy="password"]').children()
      .type('123')

    cy.get('[data-cy="submit"]').click()
    cy.wait('@submitCredentials').its('response.statusCode').should('eq', 401)
  })

  it('redirects to login page when not logged-in', () => {
    cy.visit('/pages/home')
    cy.url().should('be.equals', 'http://localhost:8100/u/login')
  })
})