import attendances from '../fixtures/attendances/attendances.json'

describe('<AttendanceList />', () => {
  before(() => {
    const baseUrl = Cypress.env('host')
    const apiServer = Cypress.env('api_server')

    cy.visit(`${baseUrl}/atendimentos`)

    cy.server()
    cy.route('GET', `${apiServer}/attendances/`, attendances).as('attendances')
  })

  it('Must render attendance list page', () => {
    cy.contains('Lista de Atendimentos')
  })

  it('Must go to attendance page', () => {
    cy.get('#attendance-1').click()

    cy.url().should('include', '/atendimentos/1/editar')
  })
})
