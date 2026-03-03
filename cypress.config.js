const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Use Vite's default dev server port
   
    
    // Update spec pattern
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },
});