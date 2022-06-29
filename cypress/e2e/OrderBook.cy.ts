// https://docs.cypress.io/api/introduction/api.html

const checkGroupByAlg = () =>
  cy
    .get(".dropdown__selected")
    .invoke("text")
    .then((groupSize) => {
      cy.get("[data-test=order-book-price-sell-1")
        .invoke("text")
        .then((val1) => {
          cy.get("[data-test=order-book-price-sell-2")
            .invoke("text")
            .then((val2) => {
              const checkOne =
                (Number(val2) - Number(val1)) % Number(groupSize);
              expect(checkOne).to.eq(0);
            });
        });
    });

describe("Order form", () => {
  it("check groupby", () => {
    cy.visit("/");
    cy.wait(3000);
    checkGroupByAlg();
  });

  it("check changing groupby", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.get(".dropdown > .tbutton").click();
    cy.get(".dropdown__list > :nth-child(4)").click();
    checkGroupByAlg();
  });

  it("check acc amount", () => {
    cy.visit("/");
    cy.wait(3000);
    cy.get('[data-test="order-book-acc-amount-sell-1"]')
      .invoke("text")
      .then((acc1) => {
        cy.get('[data-test="order-book-acc-amount-sell-2"]')
          .invoke("text")
          .then((acc2) => {
            cy.get('[data-test="order-book-amount-sell-2"]')
              .invoke("text")
              .then((amount2) => {
                expect(Math.floor(Number(acc2))).to.eq(
                  Math.floor(Number(acc1)) + Math.floor(Number(amount2))
                );
              });
          });
      });
  });
});
