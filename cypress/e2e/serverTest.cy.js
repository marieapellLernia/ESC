describe('Localhost Test', () => {
  it('Visit the ESC page', () => {
    cy.visit('http://localhost:5500');
  });

  it('Check the content of the h1 element for the displayed challenges', () => {
    cy.visit('http://localhost:5500');
    cy.get('.panel h1').should('have.text', 'Popular challenges right now');
  });
});

describe('Github Pages Test', () => {
  it('Visit the ESC page', () => {
    cy.visit('https://marieapelllernia.github.io/ESC/');
  });

  it('Get the input-element for the search bar on the challenges page', () => {
    cy.visit('https://marieapelllernia.github.io/ESC/OurChallenges');
    cy.get('.search-input');
  });

  it('Navigate the ESC page', () => {
    cy.visit('https://marieapelllernia.github.io/ESC/');
    cy.get('.mainNav ul li').eq(1).click();
    cy.get('.mainNav ul li').eq(2).click();
    cy.get('.mainNav ul li').eq(3).click();
    cy.get('.logo img').click();
  });

  it('Check alert when trying to book challenge without providing a date', async() => {
    const alertStub = cy.stub();
    cy.on('window:alert', alertStub);

    cy.visit('https://marieapelllernia.github.io/ESC/OurChallenges');
    cy.get('.BookThisRoom').eq(0).click();
    cy.get('#modal1').should('be.visible');
    cy.get('#modal1 .next-btn').should('be.visible');

    cy.get('#date').clear();
      
    cy.get('#modal1 .next-btn').click().then(async() => {
      expect(alertStub).to.be.calledWith('Please select a date');
    });
  });

  it('Check that it is possible to proceed to the next booking step when a date has been provided', () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const inputString = date.toISOString().split('T')[0];
    
    cy.visit('https://marieapelllernia.github.io/ESC/OurChallenges');
    cy.get('.BookThisRoom').eq(0).click();
    cy.get('#modal1').should('be.visible');
    cy.get('#modal1 .next-btn').should('be.visible');

    cy.get('#date').clear().type(inputString);
      
    cy.get('#modal1 .next-btn').click();
    cy.get('#modal2').should('be.visible');
  });
});