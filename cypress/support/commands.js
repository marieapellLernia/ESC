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

// Custom command to complete booking flow
Cypress.Commands.add('completeBooking', (options = {}) => {
  const defaults = {
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    time: '10:00',
    participants: 3
  };
  
  const settings = { ...defaults, ...options };
  
  // Mock APIs
  cy.intercept('GET', `**/api/times*`, {
    statusCode: 200,
    body: { slots: [settings.time] }
  }).as('getTimes');
  
  cy.intercept('POST', '**/api/bookings', {
    statusCode: 200,
    body: { success: true }
  }).as('postBooking');
  
  // Click book button if modal not open
  cy.get('body').then(($body) => {
    if (!$body.find('#modal1').length) {
      cy.get('.BookThisRoom').first().click();
    }
  });
  
  // Fill modal1
  cy.get('#date').type(settings.date);
  cy.get('#modal1 .next-btn').click();
  cy.wait('@getTimes');
  
  // Fill modal2
  cy.get('#name').type(settings.name);
  cy.get('#email').type(settings.email);
  cy.get('#tel').type(settings.phone);
  cy.get('#time').select(settings.time);
  cy.get('#participants').clear().type(settings.participants.toString());
  cy.get('#modal2 .next-btn').click();
  
  cy.wait('@postBooking');
  
  // Return chainable
  return cy.get('#modal3');
});

// Command to open modal
Cypress.Commands.add('openBookingModal', (challengeId = 1) => {
  // Ensure button exists
  cy.document().then((doc) => {
    if (!doc.querySelector('.BookThisRoom')) {
      const btn = doc.createElement('button');
      btn.className = 'BookThisRoom';
      btn.dataset.id = challengeId;
      btn.textContent = 'Book This Room';
      doc.body.appendChild(btn);
    }
  });
  
  cy.get('.BookThisRoom').click();
  return cy.get('#modal1');
});

//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })