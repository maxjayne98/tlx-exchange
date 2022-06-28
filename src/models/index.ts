export interface IRadioButtonItem {
  label: string;
  value: any;
}

export type Operation = "+" | "-";

export type Side = "buy" | "sell";

export type Order = {
  id: number;
  side: Side;
  amount: number;
  price: number;
};
