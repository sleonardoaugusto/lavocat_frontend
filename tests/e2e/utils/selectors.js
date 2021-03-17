export const errorMessage = (fieldName) => cy.get(fieldName).parent('div div div').get('.v-messages__wrapper')
