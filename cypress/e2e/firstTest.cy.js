/// <reference types="cypress" />

describe("Test with backend", () => {
  beforeEach(() => {
    cy.loginToApplication();
  });

  it("should log in", () => {
    cy.log("Hello");
  });
});
