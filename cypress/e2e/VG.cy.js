describe("Hacker Escape Room - VG Inlämning", () => {
    it('Kontrollerar att sidan finns uppe och renderar innehåll', () => {
    cy.visit('https://marieapelllernia.github.io/ESC/index.html')
    cy.contains('Popular challenges right now')
  });

  it("Som gör flera moment och navigerar från startsidan till olika sidor på sajten", () => {
    cy.visit('https://marieapelllernia.github.io/ESC/index.html')
    cy.get('#mainNav a[href="./theStory.html"]').click();
    cy.get('#mainNav li:nth-child(1) a').click();
    cy.get('a[href="index.html"] img').click();
  });

  it("Leta efter specifikt webbelement i filter av Challenges på webbsidan", () => {
    cy.visit('https://marieapelllernia.github.io/ESC/index.html')
    cy.get("#mainNav li:nth-child(1) a").click();
    cy.intercept('GET', '**/challenges*').as('loadChallenges');
    cy.wait("@loadChallenges");
    cy.get("#allChallenges").children().should("have.length.at.least", 1);
    cy.get("button.filterBtn").click();
    cy.get(".filter-interface")
      .should("have.class", "active")
      .and("be.visible");
      cy.get('.checkbox-group').should("be.visible");
    
  });

  it("Gör något som både kan bli rätt och fel och kontrollerar att webbsidan ger ett relevant svar eller felmeddelande", () => {
     cy.visit('https://marieapelllernia.github.io/ESC/index.html')
    cy.get("#mainNav li:nth-child(1) a").click();
    cy.intercept('GET', '**/challenges*').as('loadChallenges');
    cy.wait("@loadChallenges");
    cy.get("#allChallenges").children().should("have.length.at.least", 1);
    cy.get("button.filterBtn").click();
    cy.get(".filter-interface")
      .should("have.class", "active")
      .and("be.visible");
    cy.get(".search-input").type("qwerty");
    cy.contains("No challenges found.");
    cy.get(".search-input").clear().type("Hacker");
    cy.get("#allChallenges").children().should("have.length.at.least", 1);
    cy.contains("Hacker");
  });
});
