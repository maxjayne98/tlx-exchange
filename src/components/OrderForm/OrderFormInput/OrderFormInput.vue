<template>
  <div>
    <p v-if="label" class="order-form-input__label">{{ label }}</p>
    <div class="order-form-input__container">
      <div
        class="order-form-input__inner-container order-form-input__inner-container-first"
      >
        <div class="order-form-input__icon-container">
          <slot />
        </div>
        <input
          v-model="inputValue"
          ref="inp"
          class="order-form-input__input"
          type="number"
        />
        <p v-if="unit" class="order-form-input__unit">{{ unit }}</p>
      </div>
      <div class="order-form-input__inner-container">
        <TButton
          @click="increaseOnClick"
          className="order-form-input__increase-btn"
          :rounded="false"
          >+</TButton
        >
        <TButton
          @click="decreaseOnClick"
          className="order-form-input__increase-btn"
          >-</TButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  withDefaults,
  defineEmits,
  ref,
  watch,
  onUpdated,
} from "vue";
import TButton from "@/components/Shared/TButton";
export interface IOrderFormInputProps {
  inputOnChange: (value: number) => void;
  increaseOnClick: () => void;
  decreaseOnClick: () => void;
  label?: string;
  unit: string;
  className?: string;
  value: number;
}
const props = withDefaults(defineProps<IOrderFormInputProps>(), {
  inputOnChange: (value: number) => undefined,
  label: "",
  unit: "",
});
const inp = ref<HTMLInputElement>(undefined);
const emit = defineEmits(["update:value"]);
const inputValue = ref<number>(props.value || 0);
watch(inputValue, (currentValue: number) => {
  emit("update:value", currentValue);
  props.inputOnChange(currentValue);
});
onUpdated(() => {
  if (inp.value) inp.value.value = props.value.toString();
});
// watch(value, () => {
//   if (inp.value) inp.value.value = value;
// });
</script>

<style scope>
.order-form-input__container {
  display: flex;
}

.order-form-input__icon-container {
  height: 100%;
  width: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.25rem;
  align-self: stretch;
}

.order-form-input__inner-container-first {
  flex: 1;
  background-color: var(--color-background);
  border-radius: 0.25rem 0 0 0.25rem;
}

.order-form-input__inner-container {
  display: flex;
}

.order-form-input__increase-btn {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  font-weight: 700;
  font-size: 1.2rem;
}

.order-form-input__label {
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  margin-left: 0.125rem;
  color: calc(--color-text);
}

.order-form-input__input {
  flex: 1;
  background-color: transparent;
  caret-color: var(--primary-500);
}

.order-form-input__unit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.125rem;
  font-size: 0.75rem;
  width: 5ch;
}
</style>
