describe('<AttendanceList />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.intercept('GET', `${apiServer}/attendances/`, {
      fixture: 'attendances/attendances.json'
    }).as('attendances')
  })

  it('Must render attendance list page', () => {
    cy.visit(`${baseUrl}/atendimentos`)

    cy.get('.text-h4').should('contain', 'Lista de Atendimentos')
  })

  it('Must go to attendance page', () => {
    cy.visit(`${baseUrl}/atendimentos`)
    cy.wait('@attendances')

    cy.get('#attendance-1').click()

    cy.url().should('include', '/atendimentos/1/editar')
  })
})
