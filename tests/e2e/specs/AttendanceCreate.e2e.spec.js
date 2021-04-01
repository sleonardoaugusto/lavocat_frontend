import createAttendance from '../fixtures/attendances/create.json'
import statuses from '../fixtures/attendances/statuses.json'

describe('<AttendanceCreate />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.intercept('GET', `${apiServer}/attendance-statuses/`, {
      fixture: 'attendances/statuses.json'
    }).as('attendanceStatuses')
    cy.intercept('POST', `${apiServer}/attendances/`, {
      fixture: 'attendances/create.json'
    }).as('attendanceCreate')

    cy.visit(`${baseUrl}/atendimentos/novo`)
  })

  it('Should render new attendance page', () => {
    cy.get('.text-h4').should('contain', 'Novo Atendimento')
  })

  it('Should show snackbar', () => {
    cy.wait('@attendanceStatuses')

    cy.fillAttendanceForm({ ...createAttendance[0], statuses })

    cy.get('#submit').click()
    cy.wait('@attendanceCreate')

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').should('contain', 'Atendimento cadastrado!')

    cy.url().should('include', '/atendimentos')
  })
})
