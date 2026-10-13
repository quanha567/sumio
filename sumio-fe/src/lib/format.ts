import {
  formatCurrencyAmount,
  formatSignedCurrencyAmount,
  getCurrencyExponent,
  toMajorUnits,
  toMinorUnits,
} from "@sumio/common";

export {
  formatCurrencyAmount,
  formatSignedCurrencyAmount,
  getCurrencyExponent,
  toMajorUnits,
  toMinorUnits,
};

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(amount: number): string {
  return usd.format(amount);
}

function getSign(amount: number): string {
  if (amount > 0) return "+";
  if (amount < 0) return "-";
  return "";
}

export function formatSignedCurrency(amount: number): string {
  const sign = getSign(amount);
  return `${sign}${usd.format(Math.abs(amount))}`;
}
