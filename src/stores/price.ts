import { defineStore } from "pinia";

interface IPriceStates {
  price: undefined | number;
}

export const usePriceStore = defineStore({
  id: "price",
  state: (): IPriceStates => ({
    price: undefined,
  }),
  getters: {
    getPrice: (state) => state.price,
  },

  actions: {
    setPrice(value: number) {
      console.log("🚀 ~ file: price.ts ~ line 18 ~ setPrice ~ value", value);

      this.price = value;
    },
  },
});
