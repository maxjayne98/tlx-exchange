import type { Order } from "@/models";
import request from "@/utils/request";
interface ISubmitOrderOptions extends Omit<Order, "id"> {}

export const submitOrder = async (options: ISubmitOrderOptions) =>
  request.post("http://localhost:8080/orders", options);
