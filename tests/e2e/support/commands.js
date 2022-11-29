// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('fillAttendanceForm', data => {
  const { customer_name, customer_id, statuses } = data

  cy.get('#customer-name').type(customer_name)
  cy.get('#document-id').type(customer_id)
  cy.get('#status').type(statuses.key, { force: true })
})

Cypress.Commands.add('login', () => {
  const baseUrl = Cypress.env('host')
  const apiServer = Cypress.env('api_server')

  cy.visit(`${baseUrl}/`)

  cy.intercept('POST', `${apiServer}/api/token/`, {
    fixture: 'auth/login.json'
  }).as('login')

  cy.get('#username').type('admin')
  cy.get('#password').type('admin')
  cy.get('#submit').click()
})

Cypress.Commands.add('loginInvalid', () => {
  const apiServer = Cypress.env('api_server')
  cy.intercept('POST', `${apiServer}/api/token/`, {
    statusCode: 401
  }).as('login')

  cy.get('#username').type('admin')
  cy.get('#password').type('admin')
  cy.get('#submit').click()
})
