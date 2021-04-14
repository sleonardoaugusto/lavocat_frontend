describe('<AttendanceList />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.intercept('GET', `${apiServer}/attendances/`, {
      fixture: 'attendances/attendances.json'
    }).as('attendances')
    cy.intercept('GET', `${apiServer}/attendance-statuses/`, {
      fixture: 'attendances/statuses.json'
    }).as('attendanceStatuses')

    cy.login()
  })

  it('Should render attendance list page', () => {
    cy.visit(`${baseUrl}/atendimentos`)

    cy.get('.text-h4').should('contain', 'Atendimentos')
  })

  it('Should go to /attendance/{pk}/editar', () => {
    cy.visit(`${baseUrl}/atendimentos`)
    cy.wait('@attendances')

    cy.get('#attendance-1').click()

    cy.url().should('include', '/atendimentos/1/editar')
  })
})
