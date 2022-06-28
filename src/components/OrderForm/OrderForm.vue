<template>
  <div class="order-form rounded--wild">
    <div class="order-form__row">
      <TRadioButton
        class="order-form__radio-btn"
        :items="options"
        name="unit"
        v-model:value="selectedUnit"
      />
    </div>
    <div class="order-form__row">
      <OrderFormInput
        v-if="selectedUnit.value === 'BTC'"
        v-model:value="btcAmount"
        :increaseOnClick="unitOnIncrease"
        :decreaseOnClick="unitOnDecrease"
        :unit="selectedUnit.label"
        label="Quantity:"
        :inputOnChange="inputOnChange"
      >
        <Bitcoin />
      </OrderFormInput>
      <OrderFormInput
        v-else
        v-model:value="usdtAmount"
        :unit="selectedUnit.label"
        :increaseOnClick="unitOnIncrease"
        :decreaseOnClick="unitOnDecrease"
        label="Quantity:"
        :inputOnChange="inputOnChange"
      >
        <Dollar />
      </OrderFormInput>
    </div>
    <div class="order-form__button-container">
      <TButton
        @click="submitOrderOnClick"
        name="sell"
        variant="success"
        className="order-form__button"
        >Buy</TButton
      >
      <TButton
        @click="submitOrderOnClick"
        name="buy"
        variant="error"
        className="order-form__button"
        >Sell</TButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import TRadioButton from "@/components/Shared/TRadioButton";
import TButton from "@/components/Shared/TButton";
import OrderFormInput from "@/components/OrderForm/OrderFormInput";
import Bitcoin from "@/components/icons/Bitcoin.vue";
import Dollar from "@/components/icons/Dollar.vue";

import type { IRadioButtonItem } from "@/models";
import { ref } from "vue";

const options: IRadioButtonItem[] = [
  { label: "BTC", value: "BTC" },
  { label: "USDT", value: "USDT" },
];

const unitOnIncrease = () => {
  if (selectedUnit.value.value === "BTC") {
    console.log("btc +++ ");
  } else {
    console.log("btc --- ");
  }
};

const unitOnDecrease = () => {
  if (selectedUnit.value.value === "BTC") {
    console.log("btc +++ ");
  } else {
    console.log("btc --- ");
  }
};

const inputOnChange = (number: number) => console.log("number :: ", number);

const submitOrderOnClick = () => console.log("submit");
const btcAmount = ref(0.05);
const usdtAmount = ref(0.05);
const selectedUnit = ref(options[0]);
</script>

<style scoped>
.order-form {
  background-color: var(--color-background-secondary);
  padding: 1rem;
}

.order-form__radio-btn {
  padding: 0;
  margin: auto;
  display: flex;
  justify-content: center;
}
.order-form__row {
  margin: 0.75rem 0rem;
}
.order-form__button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.order-form__button {
  flex: 1;
  width: 100%;
  margin: 0 0.25rem;
  font-weight: 700;
}
</style>
