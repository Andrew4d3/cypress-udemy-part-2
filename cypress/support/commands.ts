/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
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
//
declare namespace Cypress {
  interface Chainable<Subject = any> {
    loginToApplication(): Chainable<any>;
  }
}

Cypress.Commands.add("loginToApplication", () => {
  cy.request("POST", "https://api.realworld.io/api/users/login", {
    user: {
      email: Cypress.env("username"),
      password: Cypress.env("password"),
    },
  })
    .its("body")
    .then((body) => {
      const token = body.user.token;
      cy.wrap(token).as("token");

      cy.visit("/", {
        onBeforeLoad: (win) => {
          win.localStorage.setItem("jwtToken", token);
        },
      });
    });
});
