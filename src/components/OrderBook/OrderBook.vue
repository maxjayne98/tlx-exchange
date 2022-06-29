<template>
  <div class="container">
    <template v-for="(side, index) in sides" :key="side">
      <div class="order-book__item-container rounded">
        <div class="order-book__item-side-container rounded">
          <table class="order-book__header-table">
            <thead>
              <tr class="order-book__header-row">
                <th class="order-book__header-item">Price</th>
                <th class="order-book__header-item">Amount</th>
                <th class="order-book__header-item">Total</th>
              </tr>
            </thead>
          </table>

          <div class="order-book__table-body" ref="tableContainerRef">
            <table class="order-book__data-table">
              <tbody>
                <tr
                  v-for="[key, order] in Object.entries(
                    dataStore[side].records
                  )"
                  :key="key"
                >
                  <td
                    :class="[
                      'order-book__data-row',
                      'order-book__price-data',
                      `order-book__price-data--${side}`,
                    ]"
                  >
                    {{ order.price }}
                  </td>
                  <td class="order-book__data-row">
                    {{ order.amount }}
                  </td>
                  <td class="order-book__data-row">
                    {{ order.amount }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-if="!index" class="order-book__mid-price rounded">
        MID :{{ mid }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Side } from "@/models";
import { useWebSocket } from "@/hooks/useWebSocket";
import { onUpdated } from "vue-demi";

const sides: Side[] = ["sell", "buy"];

const { dataStore } = useWebSocket();
const mid = 1.2;
onUpdated(() => console.log(dataStore));
</script>

<style lang="scss" scoped>
.order-book__item-container {
  width: 100%;
  background-color: var(--color-background-secondary);
  padding: 0.5rem;
}
.order-book__item-side-container {
  overflow: hidden;
}
.order-book__data-table {
  width: 100%;
}
.order-book__table-body {
  /* min-height: 15rem; */
  max-height: 15rem;
  overflow-y: scroll;
}
.order-book__header-table {
  width: 100%;
}
.order-book__data-row {
  border: 1px solid var(--color-primary);
  padding: 0.25rem;
  width: 15ch;
  text-align: center;
  width: 33%;
}
.order-book__header-item {
  width: 33%;
}
.order-book__price-data {
  cursor: pointer;
}
.order-book__price-data--sell {
  color: var(--color-error-500);
}

.order-book__price-data--buy {
  color: var(--color-success-500);
}

.order-book__header-row {
  background-color: var(--color-primary);
  border: 1px solid var(--color-primary);
}
.container {
  display: flex;
  flex-direction: column;
}
.order-book__mid-price {
  background-color: var(--color-background-secondary);
  margin: 1rem 0rem;
  text-align: center;
  padding: 0.5rem;
}
</style>
