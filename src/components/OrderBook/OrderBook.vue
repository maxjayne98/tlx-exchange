<template>
  <div class="container">
    <div class="order-book__options">
      <TDropDown
        label="Group Size"
        :items="groupSizeItems"
        v-model:value="selectedGroupSize"
      />
    </div>
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

          <div
            class="order-book__table-body"
            :ref="(el) => assignContainerRef(el, side)"
          >
            <table class="order-book__data-table">
              <tbody>
                <tr
                  v-for="([key, order], index) in getAggregatedOrders(
                    Object.entries(dataStore[side].aggregated),
                    side
                  )"
                  :key="key"
                  @click="() => tableRowOnClick(key)"
                >
                  <td
                    :class="[
                      'order-book__data-row',
                      'order-book__price-data',
                      `order-book__price-data--${side}`,
                    ]"
                  >
                    <span :data-test="`order-book-price-${side}-${index}`">
                      {{ key }}
                    </span>
                    $
                  </td>
                  <td
                    class="order-book__data-row"
                    :data-test="`order-book-amount-${side}-${index}`"
                  >
                    {{ order.amount.toFixed(4) }}
                  </td>
                  <td
                    class="order-book__data-row"
                    :data-test="`order-book-acc-amount-${side}-${index}`"
                  >
                    {{ order.cumAmount.toFixed(4) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        v-if="!index"
        class="order-book__mid-price rounded"
        @click="() => tableRowOnClick(Number(dataStore.midPrice))"
      >
        MID :
        <span class="order-book__mid-price-value">
          {{ dataStore.midPrice }}
        </span>
        $
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Side, IDropDownItem, type Agg } from "@/models";
import { useWebSocket } from "@/hooks/useWebSocket";
import TDropDown from "@/components/Shared/TDropDown";
import { ref, watch } from "vue";

const sides: Side[] = ["sell", "buy"];
const groupSizeItems: IDropDownItem[] = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 5, label: "5" },
  { value: 10, label: "10" },
];

const selectedGroupSize = ref<IDropDownItem>(groupSizeItems[2]);
watch(selectedGroupSize, (value) => (groupSize.value = value.value));
const { dataStore, groupSize } = useWebSocket();
const tableContainerRefs = {
  sell: ref<HTMLDivElement>(),
  buy: ref<HTMLDivElement>(),
};
const sellTableContainer = ref<HTMLDivElement>();
const buyTableContainer = ref<HTMLDivElement>();

const assignContainerRef = (el, side: Side) => {
  if (side === "buy") buyTableContainer.value = el;
  if (side === "sell") sellTableContainer.value = el;
};
const props = defineProps<{ price: number }>();
const emit = defineEmits(["update:price"]);
const setPrice = (value: number) => emit("update:price", value);
const tableRowOnClick = (value: number) => setPrice(value);
const getAggregatedOrders = (items: Agg[], side: Side) =>
  side === "sell" ? items.reverse() : items;

watch(
  () => dataStore.value.midPrice,
  (currentValue, oldValue) => {
    !oldValue && setPrice(currentValue as number);
  }
);

watch(
  () => groupSize.value,
  () => {
    buyTableContainer.value?.scrollTo({ top: 0 });
    sellTableContainer.value?.scrollTo({
      top: buyTableContainer.value?.scrollHeight,
    });
  }
);
</script>

<style lang="scss" scoped>
.order-book__item-container {
  width: 100%;
  background-color: var(--color-background-secondary);
  padding: 0.5rem;
}
.order-book__options {
  margin-bottom: 0.75rem;
}
.order-book__item-side-container {
  overflow: hidden;
}
.order-book__data-table {
  width: 100%;
}
.order-book__table-body {
  /* min-height: 15rem; */
  max-height: 10rem;
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
  cursor: pointer;
}
@media (max-width: 1024px) {
  .order-book__mid-price {
    border-bottom: 1px solid var(--color-primary);
  }
}
</style>
