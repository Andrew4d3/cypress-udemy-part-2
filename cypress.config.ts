import { defineConfig } from "cypress";

// What do these configuration options do?
export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    baseUrl: "http://localhost:4200",
    excludeSpecPattern: ["**/1-getting-started/*", "**/2-advanced-examples/*"],
    setupNodeEvents(on, config) {
      const username = process.env.DB_USERNAME;
      const password = process.env.PASSWORD;

      if (!password) {
        throw new Error("you need to set a password in your env vars");
      }

      config.env = {
        username,
        password,
      };

      return config;
    },
  },
  video: false,
  // If you don't want to expose this, you can delete these lines and use the following command:
  // DB_USERNAME="foo2@gmail.com" PASSWORD="111111" npm run cy:process
  env: {
    username: "bokew24132@moneyzon.com",
    password: "111111",
    apiUrl: "https://api.realworld.io",
  },
});
