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

  it("verify popular tags are displayed", () => {
    cy.intercept(
      { method: "Get", path: "tags" },
      {
        fixture: "tags.json",
      }
    );
    cy.get(".tag-list")
      .should("contain", "cypress")
      .and("contain", "automation")
      .and("contain", "testing");
  });

  it("intercepting and modifying the request and response", () => {
    cy.intercept("POST", "https://api.realworld.io/api/articles/", (req) => {
      req.body.article.description = "This is a description 2";
      req.reply((res) => {
        expect(res.body.article.description).to.equal(
          "This is a description 2"
        );
        res.body.article.description = "This is a description 3";
      });
    }).as("postArticles");

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
        "This is a description 3"
      );
    });
  });

  it.skip("verify global feed likes count", () => {
    cy.intercept("GET", "https://api.realworld.io/api/articles/feed*", {
      articles: [],
      articlesCount: 0,
    });

    cy.intercept("GET", "https://api.realworld.io/api/articles*", {
      fixture: "articles.json",
    });

    cy.contains("Global Feed").click();
    cy.get("app-article-list button").then((heartList) => {
      expect(heartList[0]).to.contain("1");
      expect(heartList[1]).to.contain("5");
    });

    cy.fixture("articles").then((file) => {
      const articleLink = file.articles[1].slug;
      file.articles[1].favoritesCount = 6;

      cy.intercept(
        "POST",
        `https://api.realworld.io/api/articles/${articleLink}/favorite`,
        {
          article: file.articles[1],
        }
      );

      cy.get("app-article-list button").eq(1).click().should("contain", "6");
    });
  });

  it("delete a new article", () => {
    cy.get("@token").then((token) => {
      cy.request({
        method: "POST",
        url: `${Cypress.env("apiUrl")}/api/articles/`,
        headers: {
          authorization: `Token ${token}`,
        },
        body: {
          article: {
            tagList: [],
            title: "Request from API",
            description: "API testing is easy",
            body: "React is cool",
          },
        },
      }).then((response) => {
        expect(response.status).to.equal(200);

        cy.contains("Global Feed").click();
        cy.get(".article-preview").first().click();
        cy.get(".article-actions").contains("Delete Article").click();

        cy.request({
          method: "GET",
          url: "https://api.realworld.io/api/articles?limit=10&offset=0",
          headers: {
            authorization: `Token ${token}`,
          },
        }).then((response) => {
          expect(response.body.articles[0].title).not.to.equal(
            "Request from API"
          );
        });
      });
    });
  });
});
