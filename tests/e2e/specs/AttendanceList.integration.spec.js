describe('<AttendanceList />', () => {
  const baseUrl = Cypress.env('host')

  it('Must render attendance list page', () => {
    cy.visit(`${baseUrl}/atendimentos`)

    cy.contains('Lista de Atendimentos')
  })
})
