import statuses from '../fixtures/attendances/statuses.json'
import attendances from '../fixtures/attendances/attendances.json'

describe('<AttendanceUpdate />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')
  const attendanceResp = attendances[0]

  beforeEach(() => {
    cy.server()

    cy.route('GET', `${apiServer}/attendance-statuses/`, statuses).as(
      'attendanceStatuses'
    )
    cy.route('GET', `${apiServer}/attendances/1/`, attendanceResp).as(
      'attendanceGetById'
    )
  })

  it('Must render update attendance page', () => {
    cy.visit(`${baseUrl}/atendimentos/1/editar`)

    cy.contains('Editar Atendimento')
  })

  it.todo('Must fill fields with response content', () => {
    cy.visit(`${baseUrl}/atendimentos/1/editar`)

    cy.wait('@attendanceStatuses')
    cy.wait('@attendanceGetById')

    cy.get('#customer-name').should('have.value', attendanceResp.customer_name)
    cy.get('#document-id').should('have.value', attendanceResp.document_id)
  })
})
