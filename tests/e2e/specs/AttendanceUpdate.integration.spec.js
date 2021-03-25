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

  it('Must fill fields with response content', () => {
    cy.visit(`${baseUrl}/atendimentos/1/editar`)

    cy.wait('@attendanceStatuses')
    cy.wait('@attendanceGetById')

    cy.get('#customer-name').should('have.value', 'Maria da Sorte')
    cy.get('#document-id').should('have.value', '999.999.999-99')
    cy.get('#status').siblings().should('contain', 'key')
    cy.get('#files').siblings('.v-file-input__text').should('have.length', 1)
  })
})
