import type { Order, Side, OrderId } from "@/models";
import { onMounted, ref } from "vue";

const connection = new WebSocket("ws://localhost:8080");

type Records = Record<OrderId, Order>;

interface IDataStore extends Record<Side, { records: Records }> {}
//  record of price and aggregated amount

export function useWebSocket() {
  const dataStore = ref<IDataStore>({
    buy: {
      records: {},
    },
    sell: {
      records: {},
    },
  });

  const saveOriginalOrder = (order: Order, side: Side) =>
    (dataStore.value[side].records[order.id] = order);

  const addNewOrder = (order: Order) => {
    const { side } = order;
    saveOriginalOrder(order, side);
  };

  onMounted(() => {
    connection.onopen = function () {
      console.log("connected");
    };

    connection.onerror = function () {
      console.log("connection err");
    };

    connection.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if ("existing" in data) {
        data.existing.forEach((order: Order) => addNewOrder(order));
      }
    };
  });

  return {
    dataStore,
  };
}
