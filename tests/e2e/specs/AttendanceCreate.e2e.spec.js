import createAttendance from '../fixtures/attendances/create.json'
import statuses from '../fixtures/attendances/statuses.json'

describe('<AttendanceCreate />', () => {
  const apiServer = Cypress.env('api_server')

  beforeEach(() => {
    cy.intercept('GET', `${apiServer}/attendances/`, {
      fixture: 'attendances/attendances.json',
    }).as('getAttendances')
    cy.intercept('GET', `${apiServer}/attendance-statuses/`, {
      fixture: 'attendances/statuses.json',
    }).as('getAttendanceStatuses')
    cy.intercept('POST', `${apiServer}/attendances/`, {
      fixture: 'attendances/create.json',
    }).as('postAttendance')
    cy.intercept('GET', `${apiServer}/attendances/${createAttendance.id}/`, {
      fixture: 'attendances/create.json',
    }).as('getAttendanceById')
    cy.intercept(
      'GET',
      `${apiServer}/attendances/${createAttendance.id}/notes/`,
      [],
    ).as('getNotes')

    cy.makeLogin()

    cy.get('#new-attendance').click()
  })

  it('Should redirect to /atendimentos/:id', () => {
    cy.fillAttendanceForm({ ...createAttendance, statuses })

    cy.get('#submit').click()

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').should('contain', 'Atendimento cadastrado!')

    cy.url().should('include', '/atendimentos/14/editar')
  })
})
