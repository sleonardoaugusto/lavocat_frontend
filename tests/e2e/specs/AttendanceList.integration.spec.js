import attendances from '../fixtures/attendances/attendances.json'

describe('<AttendanceList />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.server()
    cy.route('GET', `${apiServer}/attendances/`, attendances).as('attendances')
  })

  it('Must render attendance list page', () => {
    cy.visit(`${baseUrl}/atendimentos`)

    cy.contains('Lista de Atendimentos')
  })

  it('Must go to attendance page', () => {
    cy.visit(`${baseUrl}/atendimentos`)
    cy.wait('@attendances')

    cy.get('#attendance-1').click()

    cy.url().should('include', '/atendimentos/1/editar')
  })
})
