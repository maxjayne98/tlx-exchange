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
        :inputOnChange="updateUsdtAmount"
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
        :inputOnChange="updateBtcAmount"
      >
        <Coin />
      </OrderFormInput>
    </div>
    <div class="order-form__row">
      <div v-if="selectedUnit.value === 'BTC'" class="order-form__final-result">
        =
        <span class="order-form__final-result-value">
          {{ usdtAmount }}
        </span>
        <span class="order-form_final-symbol"> $ </span>
      </div>
      <div v-else class="order-form__final-result">
        =
        <span class="order-form__final-result-value">
          {{ btcAmount }}
        </span>
        <span class="order-form_final-symbol"> BTC </span>
      </div>
    </div>
    <div class="order-form__row">
      <OrderFormInput
        label="Price:"
        v-model:value="price"
        :increaseOnClick="priceOnIncrease"
        :decreaseOnClick="priceOnDecrease"
        class="order-form__final-price"
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
import Coin from "@/components/icons/Coin.vue";

import type { IRadioButtonItem, Operation } from "@/models";
import { ref, watch } from "vue";
import { roundUp } from "@/utils/helpers";
import { submitOrder } from "@/services";
import { useToast } from "vue-toastification";
import {
  BTC_EPSILON,
  CALCULATION_RESOLUTION,
  PRICE_EPSILON,
  USDT_EPSILON,
} from "@/utils/configs";
const toast = useToast();
const options: IRadioButtonItem[] = [
  { label: "BTC", value: "BTC" },
  { label: "USDT", value: "USDT" },
];

const handleBtcOnChange = (operation: Operation) => {
  const values: Record<Operation, number> = {
    "+": btcAmount.value + BTC_EPSILON,
    "-": btcAmount.value - BTC_EPSILON,
  };

  const value = values[operation];
  const calcValue = roundUp(
    (value * CALCULATION_RESOLUTION) / CALCULATION_RESOLUTION
  );
  btcAmount.value = calcValue;
  updateUsdtAmount(calcValue);
};

const handleUsdtOnChange = (operation: Operation) => {
  const values: Record<Operation, number> = {
    "+": usdtAmount.value + USDT_EPSILON,
    "-": usdtAmount.value - USDT_EPSILON,
  };

  const value = values[operation];
  const calcValue = roundUp(
    (value * CALCULATION_RESOLUTION) / CALCULATION_RESOLUTION
  );
  usdtAmount.value = calcValue;
  updateBtcAmount(calcValue);
};

const unitOnIncrease = () => {
  if (selectedUnit.value.value === "BTC") {
    handleBtcOnChange("+");
  } else {
    handleUsdtOnChange("+");
  }
};

const unitOnDecrease = () => {
  if (selectedUnit.value.value === "BTC") {
    handleBtcOnChange("-");
  } else {
    handleUsdtOnChange("-");
  }
};

const priceOnIncrease = () => {
  price.value = roundUp(
    ((price.value + PRICE_EPSILON) * CALCULATION_RESOLUTION) /
      CALCULATION_RESOLUTION
  );
};

const priceOnDecrease = () => {
  price.value = roundUp(
    ((price.value - PRICE_EPSILON) * CALCULATION_RESOLUTION) /
      CALCULATION_RESOLUTION
  );
};

const convertBtcToUsdt = (btc: number, priceInUsdt: number) =>
  roundUp(btc * priceInUsdt);

const convertUsdtToBtc = (usdt: number, priceInBtc: number) =>
  roundUp(usdt / priceInBtc);

const updateUsdtAmount = (btc: number, price: number = props.price as number) =>
  (usdtAmount.value = convertBtcToUsdt(btc, price));

const updateBtcAmount = (usdt: number, price: number = props.price as number) =>
  (btcAmount.value = convertUsdtToBtc(usdt, price));

const submitOrderOnClick = async (event: Event) => {
  try {
    const { data } = await submitOrder({
      side: event?.target?.name as Side,
      amount: btcAmount.value,
      price: price.value,
    });
    toast.success(`order ${data.result}!`);
  } catch (error) {
    toast.error("Problem :P");
  }
};

const props = defineProps<{ price: number }>();

const btcAmount = ref(0.05);
const usdtAmount = ref(0);
const price = ref(0);
const selectedUnit = ref(options[0]);

watch(
  () => props.price,
  (sp) => {
    price.value = sp;
    updateUsdtAmount(btcAmount.value, sp as number);
    updateBtcAmount(usdtAmount.value, sp as number);
  }
);
</script>

<style scoped>
.order-form {
  background-color: var(--color-background-secondary);
  padding: 1rem;
}
.order-form__row {
  margin: 0.75rem 0rem;
}
.order-form__final-result {
  border: 0.125rem solid var(--color-primary);
  border-radius: 0.25rem;
  padding: 0.125rem;
  color: var(--color-text);
  font-size: 1.3rem;
  padding: 0.5rem 0.75rem;
}
.order-form_final-symbol {
  color: var(--color-primary);
  font-weight: 700;
}
.order-form__radio-btn {
  padding: 0;
  margin: auto;
  display: flex;
  justify-content: center;
}

.order-form__button-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.order-form__button {
  flex: 1;
  width: 100%;
  font-weight: 700;
}
.order-form__button:last-child {
  margin-left: 0.25rem;
}
.order-form__button:first-child {
  margin-right: 0.25rem;
}
</style>

function roundUp(arg0: number) { throw new Error("Function not implemented."); }
