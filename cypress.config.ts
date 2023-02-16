import { defineConfig } from "cypress";

// What do these configuration options do?
export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    baseUrl: "http://localhost:4200",
    excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
    setupNodeEvents(on, config) {
      return config;
    },
  },
  video: false,
  env: {
    username: "bokew24132@moneyzon.com",
    password: "111111",
    apiUrl: "https://api.realworld.io",
  },
  retries: {
    runMode: 1, // Runninc through commmand line (CI)
    openMode: 1, // Running locally with the cypress dashboard
  },
});
