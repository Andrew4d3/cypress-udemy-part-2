/// <reference types="cypress" />

describe("Test with backend", () => {
  beforeEach(() => {
    cy.loginToApplication();
  });

  it("should log in", () => {
    cy.intercept("POST", "https://api.realworld.io/api/articles/").as(
      "postArticles"
    );

    const now = Date.now();
    cy.contains("New Article").click();
    cy.get('[formcontrolname="title"]').type("This is the title " + now);
    cy.get('[formcontrolname="description"]').type("This is a description");
    cy.get('[formcontrolname="body"]').type("This is a body of the article");
    cy.contains("Publish Article").click();

    cy.wait("@postArticles").then((xhr) => {
      expect(xhr.response.statusCode).to.equal(200);
      expect(xhr.request.body.article.body).to.equal(
        "This is a body of the article"
      );
      expect(xhr.response.body.article.description).to.equal(
        "This is a description"
      );
    });
  });
});
