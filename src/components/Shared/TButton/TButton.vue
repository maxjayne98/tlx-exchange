<template>
  <button
    :class="[
      'tbutton',
      `tbutton--${variant}`,
      rounded && 'tbutton--rounded',
      `${className}`,
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import type { ButtonHTMLAttributes } from "vue";
type IButtonVariants = "success" | "error" | "primary";
export interface ITButtonProps extends ButtonHTMLAttributes {
  label?: string;
  variant: IButtonVariants;
  rounded: boolean;
  className: string;
}
const props = withDefaults(defineProps<ITButtonProps>(), {
  variant: "primary",
  rounded: true,
});
</script>

<style scoped>
.tbutton {
  padding: 0.25rem 0.5rem;
}
.tbutton--rounded {
  border-radius: 0.25rem;
}
.tbutton--success {
  background-color: var(--color-success-500);
}
.tbutton--primary {
  background-color: var(--color-primary);
}
.tbutton--success:hover {
  background-color: var(--color-success-200);
}

.tbutton--error {
  background-color: var(--color-error-500);
}
.tbutton--error:hover {
  background-color: var(--color-error-200);
}
</style>
