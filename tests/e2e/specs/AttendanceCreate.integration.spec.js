// https://docs.cypress.io/api/introduction/api.html
import createAttendance from '../fixtures/attendances/create.json'
import statuses from '../fixtures/attendances/statuses.json'

describe('<AttendanceCreate />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.server()

    cy.route('GET', `${apiServer}/attendance-statuses/`, statuses).as(
      'attendanceStatuses'
    )
    cy.route('POST', `${apiServer}/attendances/`, createAttendance).as(
      'attendanceCreate'
    )
  })

  it('Must render new attendance page', () => {
    cy.visit(`${baseUrl}/atendimentos/novo`)

    cy.get('.text-h4').should('contain', 'Novo Atendimento')
  })

  it('Must show snackbar', () => {
    cy.visit(`${baseUrl}/atendimentos/novo`)

    cy.wait('@attendanceStatuses')

    const data = createAttendance[0]
    cy.get('#customer-name').type(data.customer_name)
    cy.get('#document-id').type(data.customer_id)
    cy.get('#status').type(statuses.key, { force: true })

    cy.get('#submit').click()
    cy.wait('@attendanceCreate')

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').should('contain', 'Atendimento criado!')
  })
})
