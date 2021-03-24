// https://docs.cypress.io/api/introduction/api.html
import createAttendance from '../fixtures/attendances/create.json'

describe('<AttendanceForm />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  it('Must render new attendance page', () => {
    cy.visit(`${baseUrl}/atendimento/novo`)

    cy.contains('Novo Atendimento')
  })

  it('Must show snackbar', () => {
    cy.visit(baseUrl)

    const data = createAttendance[0]
    cy.get('#customer-name').type(data.customer_name)
    cy.get('#document-id').type(data.customer_id)

    cy.server()
    cy.route('POST', `${apiServer}/attendances/`, {
      fixture: 'attendances/create.json'
    }).as('attendanceCreate')

    cy.get('#submit').click()
    cy.wait('@attendanceCreate')

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').contains('Operação concluída!')
  })
})
