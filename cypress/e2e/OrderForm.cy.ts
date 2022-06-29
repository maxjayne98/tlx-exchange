// https://docs.cypress.io/api/introduction/api.html

describe("Order form", () => {
  it("calc final transaction value", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.get(
      ".order-form__final-price > .order-form-input__container > .order-form-input__inner-container-first > .order-form-input__input"
    )
      .invoke("val")
      .then((price) => {
        cy.get(
          ":nth-child(2) > div > .order-form-input__container > .order-form-input__inner-container-first > .order-form-input__input"
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

  it("form input btn manipulation", () => {
    cy.visit("/");
    const increse = () =>
      cy
        .get(
          ":nth-child(2) > div > .order-form-input__container > :nth-child(2) > :nth-child(1)"
        )
        .click();
    const decrese = () =>
      cy
        .get(
          ":nth-child(2) > div > .order-form-input__container > :nth-child(2) > .tbutton--rounded"
        )
        .click();
    const increaseTime = 6;
    const decreaseTime = 2;
    for (let index = 0; index < increaseTime; index++) increse();
    for (let index = 0; index < decreaseTime; index++) decrese();

    cy.get(
      ":nth-child(2) > div > .order-form-input__container > .order-form-input__inner-container-first > .order-form-input__input"
    ).should("have.value", `${(increaseTime + 1 - decreaseTime) * 0.05}`);
  });
});
