describe('<AttendanceUpdate />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  it('Should redirect to /atendimentos after login', () => {
    cy.intercept('GET', `${apiServer}/attendances/`, {}).as('attendances')

    cy.visit(`${baseUrl}/login`)
    cy.login()

    cy.location('pathname').should('include', '/atendimentos')
  })

  it('Should not redirect to /attendances if credentials are invalid', () => {
    cy.visit(`${baseUrl}/login`)
    cy.loginInvalid()

    cy.location('pathname').should('include', '/login')
  })

  it('Should redirect to /login if is not logged in', () => {
    cy.visit(`${baseUrl}/`)

    cy.location('pathname').should('include', '/login')
  })

  it('Should logout if status code is 401', () => {
    cy.intercept('GET', `${apiServer}/attendances/`, {
      statusCode: 401
    }).as('attendances')

    cy.visit(`${baseUrl}/login`)
    cy.login()

    cy.location('pathname').should('include', '/login')
  })
})
