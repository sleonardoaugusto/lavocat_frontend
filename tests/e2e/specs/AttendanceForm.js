// https://docs.cypress.io/api/introduction/api.html
import faker from 'faker'
import { errorMessage } from '../utils/selectors'

describe('<AttendanceForm />', () => {
  const BASE_URL = 'http://localhost:8080'
  it('Button click must trigger invalid form', () => {
    cy.visit(BASE_URL)

    cy.get('#submit').click()

    errorMessage('#customer-name').should('contain', 'Campo obrigatório')
    errorMessage('#document-id').should('contain', 'Campo obrigatório')
  })

  it('#document-id length field must be invalid', () => {
    cy.visit(BASE_URL)

    cy.get('#document-id').type('9999999999')

    errorMessage('#document-id').should('contain', 'Campo deve conter 11 dígitos')
  })

  it('Fields must be valid', () => {
    cy.visit(BASE_URL)

    cy.get('#customer-name').type(faker.random.word())
    cy.get('#document-id').type('99999999999')

    errorMessage('#customer-name').should('contain', '')
    errorMessage('#document-id').should('contain', '')
  })

  it('Snackbar must be visible', () => {
    cy.visit(BASE_URL)

    cy.get('#customer-name').type(faker.random.word())
    cy.get('#document-id').type('99999999999')

    cy.get('#submit').click()

    cy.get('.v-snack__wrapper').should('be.visible')
  })
})
