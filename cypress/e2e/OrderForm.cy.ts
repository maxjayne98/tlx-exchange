// https://docs.cypress.io/api/introduction/api.html

describe("Order form", () => {
  it("Cacl final transaction value", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.get(
      ".order-form__final-price > .order-form-input__container > .order-form-input__inner-container-first > .order-form-input__input"
    )
      .invoke("val")
      .then((price) => {
        cy.get(
          ':nth-child(2) > div[data-v-c631f816=""] > .order-form-input__container > .order-form-input__inner-container-first > .order-form-input__input'
        )
          .invoke("val")
          .then((btc) => {
            cy.get(".order-form__final-result-value").should(
              "have.text",
              price * btc
            );
          });
      });
  });
});
