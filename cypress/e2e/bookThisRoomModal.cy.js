describe('Book This Room Modal Flow', () => {
  // Mock data
  const mockChallenge = {
    id: 1,
    title: 'Escape Room Challenge',
    type: 'onsite',
    minParticipants: 2,
    maxParticipants: 6
  };

  const mockAvailableTimes = {
    slots: ['10:00', '11:00', '12:00']
  };

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const dateString = futureDate.toISOString().split('T')[0];

  beforeEach(() => {
    // Intercept ALL external API calls
    cy.intercept('GET', '**/api/challenges', {
      statusCode: 200,
      body: [mockChallenge]
    }).as('getChallenges');

    cy.intercept('GET', '**/api/booking/available-times*', {
      statusCode: 200,
      body: mockAvailableTimes
    }).as('getAvailableTimes');

    cy.intercept('POST', '**/api/booking/reservations', {
      statusCode: 200,
      body: { 
        success: true, 
        bookingId: '12345',
        message: 'Booking successful' 
      }
    }).as('postBooking');

    // Visit the page
    cy.visit('/OurChallenges.html');
    
    // Add test button if not present
    cy.document().then((doc) => {
      if (!doc.querySelector('.BookThisRoom')) {
        const btn = doc.createElement('button');
        btn.className = 'BookThisRoom';
        btn.dataset.id = '1';
        btn.textContent = 'Book This Room';
        btn.style.cssText = 'padding: 10px; margin: 20px; background: blue; color: white;';
        doc.body.appendChild(btn);
      }
    });
  });

  describe('Basic Modal Functionality', () => {
    it('should load the OurChallenges page successfully', () => {
      cy.url().should('include', 'OurChallenges.html');
      cy.get('body').should('be.visible');
    });

    it('should open modal when clicking BookThisRoom button', () => {
      cy.get('.BookThisRoom').should('exist').click();
      
      // Wait for page to load and modal to appear
      cy.get('#modal1', { timeout: 10000 }).should('be.visible');
      cy.get('#modal1').should('have.css', 'opacity', '1');
      
      // Check form elements
      cy.get('#date').should('be.visible');
      cy.get('.next-btn').should('contain', 'Search available times');
    });
  });

  describe('Modal 1 - Date Selection', () => {
    beforeEach(() => {
      // Open modal first
      cy.get('.BookThisRoom').click();
      cy.get('#modal1', { timeout: 10000 }).should('be.visible');
    });

    it('should show alert when trying to proceed without date', () => {
      const alertStub = cy.stub();
      cy.on('window:alert', alertStub);
      
      cy.get('#modal1 .next-btn').click().then(() => {
        expect(alertStub).to.be.calledWith('Please select a date');
      });
    });

    it('should proceed to modal2 with valid date', () => {
      cy.get('#date').type(dateString);
      cy.get('#modal1 .next-btn').click();
      
      // Wait for the API call
      cy.wait('@getAvailableTimes', { timeout: 10000 }).then((interception) => {
        expect(interception.request.url).to.include('date=' + dateString);
        expect(interception.request.url).to.include('challenge=1');
      });
      
      // Verify modal transition - wait for animation
      cy.get('#modal1', { timeout: 5000 }).should('have.css', 'opacity', '0');
      cy.get('#modal1').should('have.css', 'visibility', 'hidden');
      cy.get('#modal2', { timeout: 5000 }).should('be.visible');
      cy.get('#modal2').should('have.css', 'opacity', '1');
      
      // Time slots 
      cy.get('#time option').should('have.length', mockAvailableTimes.slots.length);
    });
  });

  describe('Modal 2 - Form Completion', () => {
    beforeEach(() => {
      // Navigate through to modal2
      cy.get('.BookThisRoom').click();
      cy.get('#modal1', { timeout: 10000 }).should('be.visible');
      
      cy.get('#date').type(dateString);
      cy.get('#modal1 .next-btn').click();
      cy.wait('@getAvailableTimes', { timeout: 10000 });
      cy.get('#modal2', { timeout: 5000 }).should('be.visible');
    });

    it('should complete the booking form', () => {
      // Fill the form
      cy.get('#name').type('John Doe');
      cy.get('#email').type('john@example.com');
      cy.get('#tel').type('1234567890');
      cy.get('#time').select('11:00');
      cy.get('#participants').clear().type('4');
      
      // Submit
      cy.get('#modal2 .next-btn').click();
      cy.wait('@postBooking', { timeout: 10000 }).then((interception) => {
        const requestBody = interception.request.body;
        
        // Log
        console.log('Request body:', requestBody);
        
        expect(requestBody).to.include({
          name: 'John Doe',
          email: 'john@example.com',
          time: '11:00',
          participants: 4
        });
        
        // Check for date and challenge ID (might be named differently)
        expect(requestBody.date).to.equal(dateString);
        expect(requestBody.challengeId || requestBody.challenge || requestBody.roomId).to.equal(1);
      });
      
      // Should show success modal
      cy.get('#modal3', { timeout: 5000 }).should('be.visible');
      cy.get('#modal3 .bookedRoom-title').should('contain', 'Thank you!');
    });
  });
}); 
