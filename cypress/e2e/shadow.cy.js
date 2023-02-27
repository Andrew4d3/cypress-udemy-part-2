describe("shadow dom", () => {
  it("access shadow dom", () => {
    cy.visit("https://radogado.github.io/shadow-dom-demo/");

    // We need to get the shadow host first
    cy.get("#app").shadow().find("#container");
  });
});
