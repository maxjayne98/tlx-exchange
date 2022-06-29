export const roundUp = (number: number): number => Number(number.toFixed(10));
export const roundTo = (src: number, target: number): number =>
  Math.ceil(src / target) * target;
