const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'zn3hyu',
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./tests/e2e/plugins/index.js')(on, config)
    },
    excludeSpecPattern: '**/examples/*.spec.js',
    specPattern: 'tests/e2e/specs/**/*.{js,jsx,ts,tsx}',
    supportFile: 'tests/e2e/support/index.js',
  },
})
