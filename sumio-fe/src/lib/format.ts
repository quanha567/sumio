const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(amount: number): string {
  return usd.format(amount);
}

export function formatSignedCurrency(amount: number): string {
  const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
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

export function formatSignedMoney(
  minorUnits: number,
  type: "income" | "expense",
  currency: string = "USD",
  locale: string = "en-US",
): string {
  const formatted = formatMoney(minorUnits, currency, locale);
  return type === "income" ? `+${formatted}` : `-${formatted}`;
}
