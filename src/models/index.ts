export interface IRadioButtonItem {
  label: string;
  value: any;
}

export type Operation = "+" | "-";

export type Side = "buy" | "sell";
export type OrderId = number;
export type Order = {
  id: number;
  side: Side;
  amount: number;
  price: number;
};
export type Agg = {
  amount: number;
  count: number;
  cumAmount: number;
};
