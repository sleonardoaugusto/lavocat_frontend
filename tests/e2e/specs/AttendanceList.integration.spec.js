describe('<AttendanceList />', () => {
  before(() => {
    const baseUrl = Cypress.env('host')
    cy.visit(`${baseUrl}/atendimentos`)
  })

  it('Must render attendance list page', () => {
    cy.contains('Lista de Atendimentos')
  })

  it('Must go to attendance page', () => {
    cy.get('#attendance-1').click()

    cy.url().should('include', '/atendimentos/1/editar')
  })
})
