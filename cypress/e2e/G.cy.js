describe('My First Test', () => {
  it('Visits Hacker escape room', () => {
    cy.visit('/')
    cy.contains('Popular challenges right now')
  })
})