import { defineStore } from "pinia";

interface IPriceStates {
  price: number;
}

export const usePriceStore = defineStore({
  id: "price",
  state: (): IPriceStates => ({
    price: 0,
  }),
  getters: {
    getPrice: (state) => state.price,
  },

  actions: {
    setPrice(value: number) {
      this.price = value;
    },
  },
});
