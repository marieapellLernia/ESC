describe ('Static HTML Element Tests', () => {
    it('Page load from localhost and contains H1 element', () => {
        cy.visit('http://localhost:5501')

        cy.url().should('include', 'localhost')

        cy.get('h1')
        .should('be.visible')
        .and('contain', 'Hacker Escape Rooms')
    })
});