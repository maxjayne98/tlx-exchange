<template>
  <ul class="radioButtons__container">
    <li
      class="radioButtons__item-container"
      :key="value"
      @click="() => itemOnClick({ value, label })"
      v-for="{ value, label } in items"
    >
      <input
        type="radio"
        :id="value"
        :name="name"
        :value="value"
        :checked="selectedValue && selectedValue.value === value"
      />
      <label class="radioButtons__label" :for="value">{{ label }}</label>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { IRadioButtonItem } from "@/models";
import { defineProps, defineEmits, ref, watch } from "vue";

export interface IRadioButtonProps {
  label?: string;
  items: Array<IRadioButtonItem>;
  name: string;
  value: IRadioButtonItem;
}

const props = defineProps<IRadioButtonProps>();
const emit = defineEmits(["update:value"]);
const selectedValue = ref<IRadioButtonItem | undefined>(
  props.value || undefined
);
const itemOnClick = (item: IRadioButtonItem) => (selectedValue.value = item);
watch(selectedValue, (currentValue) => emit("update:value", currentValue));
</script>

<style>
.radioButtons__container {
  display: flex;
}

.radioButtons__item-container {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

.radioButtons__item-container > * {
  cursor: pointer;
}

.radioButtons__item-container > label {
  margin-left: 0.25rem;
  color: var(--color-text);
}

.radioButtons__container input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  margin: 0;
  font: inherit;
  color: var(--color-primary);
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  transform: translateY(-0.07rem);
  display: flex;
  justify-content: center;
  align-items: center;
}

.radioButtons__container input[type="radio"]::before {
  content: "";
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--color-primary);
  background-color: var(--color-primary);
}

.radioButtons__container input[type="radio"]:checked::before {
  transform: scale(1);
}

.radioButtons__container input[type="radio"]:focus {
  outline: max(2px, 0.15rem) solid var(--color-primary);
  outline-offset: max(2px, 0.1rem);
}
</style>
