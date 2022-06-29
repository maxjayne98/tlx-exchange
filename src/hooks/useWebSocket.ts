import type { Agg, Order, OrderId, Side, Operation } from "@/models";
import { onMounted, ref, watch } from "vue";
import { roundTo } from "@/utils/helpers";

const connection = new WebSocket("ws://localhost:8080");

type Records = Record<OrderId, Order>;

interface IDataStore
  extends Record<Side, { records: Records; aggregated: Aggregated }> {
  midPrice: number | undefined;
}
//  record of price and aggregated amount
type Aggregated = Record<number, Agg>;

export function useWebSocket() {
  const dataStore = ref<IDataStore>({
    buy: {
      records: {},
      aggregated: {},
    },
    sell: {
      records: {},
      aggregated: {},
    },
    midPrice: undefined,
  });
  const groupSize = ref(5);

  const generateAggregatedInitialOrder = (
    { amount }: Order,
    roundedPrice: number,
    side: Side
  ) => {
    dataStore.value[side].aggregated[roundedPrice] = {
      amount: amount,
      count: 1,
      cumAmount: 0,
    };
  };

  const saveOriginalOrder = (order: Order, side: Side) =>
    (dataStore.value[side].records[order.id] = order);

  const removeOrder = (id: number, side: Side) =>
    delete dataStore.value[side].records[id];

  const removeAggregatedOrder = (roundedPrice: number, side: Side) =>
    delete dataStore.value[side].aggregated[roundedPrice];

  const updateAggregated = (
    { amount }: Order,
    roundedPrice: number,
    side: Side,
    operation: Operation
  ) => {
    if (operation === "+") {
      dataStore.value[side].aggregated[roundedPrice].amount += amount;
      dataStore.value[side].aggregated[roundedPrice].count += 1;
    } else {
      dataStore.value[side].aggregated[roundedPrice].amount -= amount;
      dataStore.value[side].aggregated[roundedPrice].count -= 1;
    }
  };

  const getRoundedPrice = (price: number) => roundTo(price, groupSize.value);

  const calcCumulativeAmountBuySide = () => {
    let sum = 0;
    Object.entries(dataStore.value.buy.aggregated)
      .reverse()
      .forEach(([_key, value]: [number, Agg]) => {
        sum += value.amount;
        value.cumAmount = sum;
      });
  };

  const calcCumulativeAmountSellSide = () => {
    let sum = 0;
    Object.entries(dataStore.value.sell.aggregated).forEach(
      ([_key, value]: [number, Agg]) => {
        sum += value.amount;
        value.cumAmount = sum;
      }
    );
  };

  const regenerateAggregated = () => {
    dataStore.value.buy.aggregated = {};
    dataStore.value.sell.aggregated = {};
    const update = (order: Order) => {
      const roundedPrice = getRoundedPrice(order.price);
      if (!(roundedPrice in dataStore.value[order.side].aggregated)) {
        generateAggregatedInitialOrder(order, roundedPrice, order.side);
      } else {
        updateAggregated(order, roundedPrice, order.side, "+");
      }
    };
    Object.values(dataStore.value.buy.records).forEach(update);
    Object.values(dataStore.value.sell.records).forEach(update);
  };

  const addNewOrder = (order: Order) => {
    const { side, price } = order;
    const roundedPrice = getRoundedPrice(price);
    saveOriginalOrder(order, side);
    if (!(roundedPrice in dataStore.value[side].aggregated)) {
      generateAggregatedInitialOrder(order, roundedPrice, side);
    } else {
      updateAggregated(order, roundedPrice, side, "+");
    }
  };

  const deleteOrder = (id: number) => {
    const record =
      dataStore.value.buy.records[id] || dataStore.value.sell.records[id];
    if (record) {
      const side = record.side;
      const roundedPrice = getRoundedPrice(record.price);
      updateAggregated(record, roundedPrice, side, "-");
      removeOrder(id, side);
      if (!dataStore.value[side].aggregated[roundedPrice].amount)
        removeAggregatedOrder(roundedPrice, side);
    }
  };

  const updateMidPrice = () => {
    dataStore.value.midPrice = getMidPrice();
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
      } else {
        if ("delete" in data) {
          data.delete.forEach((id: number) => deleteOrder(id));
        }
        if ("insert" in data) {
          data.insert.forEach((order: Order) => addNewOrder(order));
        }
      }
      calcCumulativeAmountBuySide();
      calcCumulativeAmountSellSide();
      updateMidPrice();
    };
  });

  const getMidPrice = () => {
    return (
      (Number(Object.keys(dataStore.value.sell.aggregated).at(-1)) +
        Number(Object.keys(dataStore.value.sell.aggregated)[0])) /
      2
    );
  };
  watch(groupSize, regenerateAggregated);
  return {
    dataStore,
    groupSize,
  };
}
