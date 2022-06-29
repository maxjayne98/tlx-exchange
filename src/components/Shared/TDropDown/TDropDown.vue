<template>
  <div class="dropdown">
    <div>
      <label class="dropdown__label" :for="name">{{ label }}</label>
    </div>
    <TButton @click="buttonOnClick" class="dropdown__button" :name="name">
      <div class="dropdown__selected">
        {{ value.value || "select" }}
      </div>
      <div :class="['dropdown__arrow', isClicked && 'dropdown__arrow--down']">
        <ArrowDown />
      </div>
    </TButton>
    <div class="dropdown__list-container">
      <ul
        v-if="isClicked"
        :class="[
          'dropdown__list',
          isClicked && 'dropdown__list--show',
          'rounded',
        ]"
      >
        <li
          v-for="{ label, value } in items"
          @click="() => itemOnClick({ value, label })"
          :key="value"
          class="dropdown__item rounded"
        >
          {{ label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import TButton from "@/components/Shared/TButton";
import ArrowDown from "@/components/icons/ArrowDown.vue";
import type { IDropDownItem } from "@/models";
import { ref } from "vue";

export interface ITDropDownProps {
  items: IDropDownItem[];
  label: string;
  name: string;
  value: IDropDownItem;
}

const isClicked = ref<boolean>(false);
const emit = defineEmits(["update:value"]);
const props = defineProps<ITDropDownProps>();
const selectedValue = ref<IDropDownItem | undefined>(props.value || undefined);
const itemOnClick = (item: IDropDownItem) => {
  buttonOnClick();
  selectedValue.value = item;
  emit("update:value", item);
};
const buttonOnClick = () => (isClicked.value = !isClicked.value);
</script>

<style lang="scss" scoped>
.dropdown {
  display: inline-flex;
  flex-direction: column;
}

.dropdown__label {
  color: var(--color-text);
  background-color: var(--color-background);
  font-size: 0.6rem;
}
.dropdown__button {
  font-size: 0.75rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.dropdown__selected {
  min-width: 2ch;
  font-size: 0.75rem;
}

.dropdown__arrow {
  transition: 0.1s;
  font-size: 2rem;
  margin-left: 0.5rem;
}
.dropdown__arrow--down {
  transform: rotate(-180deg);
}
.dropdown__list-container {
  position: relative;
}
.dropdown__list {
  position: absolute;
  background-color: var(--color-background-secondary);
  width: 100%;
  height: 0;
  z-index: var(--z-index-1000);
  margin-top: 0.25rem;
  padding: 0.25rem;
}
.dropdown__list--show {
  height: auto;
}
.dropdown__item {
  margin: 0.25rem;
  padding: 0.25rem;
  cursor: pointer;
}
.dropdown__item:hover {
  background-color: var(--color-background);
}
</style>
