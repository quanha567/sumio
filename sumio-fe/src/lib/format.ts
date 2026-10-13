import {
  formatCurrencyAmount,
  getCurrencyExponent,
  toMajorUnits,
  toMinorUnits,
} from "@sumio/common";

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

export { getCurrencyExponent };

export function minorUnitsToMajor(amount: number, currency: string): number {
  return toMajorUnits(amount, currency);
}

export function majorUnitsToMinor(amount: number, currency: string): number {
  return Number(toMinorUnits(amount, currency));
}

export function formatMoney(
  minorUnits: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return formatCurrencyAmount(minorUnits, currency, locale);
}

export interface FormatMoneyOptions {
  currency?: string;
  locale?: string;
}

export function formatSignedMoney(
  minorUnits: number,
  type: "income" | "expense",
  options?: string | FormatMoneyOptions,
): string {
  const currency = typeof options === "string" ? options : (options?.currency ?? "USD");
  const locale = typeof options === "object" ? (options?.locale ?? "en-US") : "en-US";
  const formatted = formatMoney(minorUnits, currency, locale);
  return type === "income" ? `+${formatted}` : `-${formatted}`;
}
