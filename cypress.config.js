const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,
  waitForAnimations: false,
  animationDistanceThreshold: 50,

  e2e: {
    baseUrl: "http://127.0.0.1:5501",
    setupNodeEvents(on, config) {},
  },
});
