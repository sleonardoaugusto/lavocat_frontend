import createAttendance from '../fixtures/attendances/create.json'
import statuses from '../fixtures/attendances/statuses.json'

describe('<AttendanceUpdate />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.server()

    cy.route('GET', `${apiServer}/attendance-statuses/`, statuses).as(
      'attendanceStatuses'
    )
  })

  it('Must render update attendance page', () => {
    cy.visit(`${baseUrl}/atendimentos/1/editar`)

    cy.contains('Editar Atendimento')
  })

  // it('Must fill fields with response content', () => {
  //   cy.visit(`${baseUrl}/atendimentos/1/editar`)
  //
  //   cy.wait('@attendanceStatuses')
  // })
})
