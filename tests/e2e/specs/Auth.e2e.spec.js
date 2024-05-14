describe('<Auth />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  it('Should redirect to /atendimentos after login', () => {
    cy.intercept('GET', `${apiServer}/attendances/`, {}).as('getAattendances')
    cy.intercept('GET', `${apiServer}/attendance-statuses/`, {}).as(
      'getAttendanceStatuses',
    )

    cy.visit(`${baseUrl}/login`)
    cy.makeLogin()

    cy.location('pathname').should('include', '/atendimentos')
  })

  it('Should not redirect to /attendances if credentials are invalid', () => {
    cy.visit(`${baseUrl}/login`)
    cy.makeLoginInvalidCredentials()

    cy.location('pathname').should('include', '/login')
  })

  it('Should show snackbar', () => {
    cy.visit(`${baseUrl}/login`)
    cy.makeLoginInvalidCredentials()

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').should('contain', 'Credenciais inválidas.')
  })

  it('Should redirect to /login if is not logged in', () => {
    cy.visit(`${baseUrl}/atendimentos/`)

    cy.location('pathname').should('include', '/login')
  })

  it('Should logout if status code is 401', () => {
    cy.intercept('GET', `${apiServer}/attendances/`, {
      statusCode: 401,
    }).as('getAttendances')

    cy.visit(`${baseUrl}/login`)
    cy.makeLogin()

    cy.location('pathname').should('include', '/login')
  })
})
