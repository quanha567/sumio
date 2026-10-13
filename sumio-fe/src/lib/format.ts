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

export const CURRENCY_EXPONENTS: Record<string, number> = {
  USD: 2,
  EUR: 2,
  GBP: 2,
  CAD: 2,
  AUD: 2,
  SGD: 2,
  JPY: 0,
  VND: 0,
};

export function getCurrencyExponent(currency: string): number {
  return CURRENCY_EXPONENTS[currency.toUpperCase()] ?? 2;
}

export function minorUnitsToMajor(amount: number, currency: string): number {
  const exp = getCurrencyExponent(currency);
  return amount / Math.pow(10, exp);
}

export function majorUnitsToMinor(amount: number, currency: string): number {
  const exp = getCurrencyExponent(currency);
  return Math.round(amount * Math.pow(10, exp));
}

export function formatMoney(
  minorUnits: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  const major = minorUnitsToMajor(minorUnits, currency);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(major);
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
