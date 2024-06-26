import attendances from '../fixtures/attendances/attendances.json'

describe('<AttendanceUpdate />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')
  const attendanceResp = attendances[0]

  beforeEach(() => {
    cy.intercept('GET', `${apiServer}/attendance-statuses/`, {
      fixture: 'attendances/statuses.json',
    }).as('getAttendanceStatuses')
    cy.intercept('GET', `${apiServer}/attendances/1/`, attendanceResp).as(
      'getAttendanceById',
    )
    cy.intercept('GET', `${apiServer}/attendances/`, {
      fixture: 'attendances/attendances.json',
    }).as('getAttendances')
    cy.intercept('PUT', `${apiServer}/attendances/1/`, {}).as(
      'updateAttendance',
    )

    cy.makeLogin()
  })

  it('Should fill fields with response content', () => {
    cy.get('#attendance-1').click()

    cy.get('#customer-name').should('have.value', 'Maria da Sorte')
    cy.get('#document-id').should('have.value', '999.999.999-99')
    cy.get('#files').siblings('.v-file-input__text').should('have.length', 1)
    cy.get('#resume').should('have.value', 'Some text')
  })

  it('Should show snackbar', () => {
    cy.visit(`${baseUrl}/atendimentos/1/editar`)

    cy.get('#submit').click()

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').should('contain', 'Atendimento salvo!')
  })
})
