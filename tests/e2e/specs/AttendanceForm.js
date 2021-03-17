// https://docs.cypress.io/api/introduction/api.html
import faker from 'faker'
import { errorMessage } from '../utils/selectors'
import createAttendance from '../fixtures/attendances/create.json'

describe('<AttendanceForm />', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  it('Button click must trigger invalid form', () => {
    cy.visit(baseUrl)

    cy.get('#submit').click()

    errorMessage('#customer-name').should('contain', 'Campo obrigatório')
    errorMessage('#document-id').should('contain', 'Campo obrigatório')
  })

  it('#document-id length field must be invalid', () => {
    cy.visit(baseUrl)

    cy.get('#document-id').type('9999999999')

    errorMessage('#document-id').should('contain', 'Campo deve conter 11 dígitos')
  })

  it('Fields must be valid', () => {
    cy.visit(baseUrl)

    cy.get('#customer-name').type(faker.random.word())
    cy.get('#document-id').type('99999999999')

    errorMessage('#customer-name').should('contain', '')
    errorMessage('#document-id').should('contain', '')
  })

  it('Snackbar must be visible', () => {
    cy.visit(baseUrl)

    const data = createAttendance[0]
    cy.get('#customer-name').type(data.customer_name)
    cy.get('#document-id').type(data.customer_id)

    cy.intercept('POST', `${apiServer}/attendances/`, {
      fixture: 'attendances/create.json'
    }).as('attendanceCreate')
    cy.get('#submit').click()
    cy.wait('@attendanceCreate')

    cy.get('.v-snack__wrapper').should('be.visible')
    cy.get('.v-snack__wrapper').contains('Operação concluída!')
  })
})
