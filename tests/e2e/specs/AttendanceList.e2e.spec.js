describe('<AttendanceList />', () => {
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
    cy.get('.text-h4').should('contain', 'Atendimentos')
  })
})
