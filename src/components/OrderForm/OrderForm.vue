<template>
  <div class="order-form rounded--wild fake-class">
    <div>
      <TRadioButton
        class="order-form__radio-btn"
        :items="options"
        name="unit"
        v-model:value="selectedUnit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TRadioButton from "@/components/Shared/TRadioButton";

import type { IRadioButtonItem } from "@/models";
import { ref } from "vue";

const options: IRadioButtonItem[] = [
  { label: "BTC", value: "BTC" },
  { label: "USDT", value: "USDT" },
];
const selectedUnit = ref(options[0]);
</script>

<style scoped>
.order-form {
  background-color: var(--color-background-secondary);
  padding: 1rem;
}
.fake-class {
  height: 20rem;
  width: 20rem;
}

.order-form__radio-btn {
  padding: 0;
  margin: auto;
  display: flex;
  justify-content: center;
}
</style>
