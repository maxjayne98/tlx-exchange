<template>
  <div class="app__order-book">
    <OrderForm v-model:price="price" />
  </div>

  <div>
    <OrderBook v-model:price="price" />
  </div>
</template>

<script setup lang="ts">
import OrderForm from "@/components/OrderForm";
import OrderBook from "@/components/OrderBook";
import { ref } from "vue";
const price = ref(0);
</script>

<style>
@import "@/assets/styles/base.css";
@import "@/assets/styles/normalizer.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }

  #app {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem;
  }

  .app__order-book {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
