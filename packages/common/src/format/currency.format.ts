import { formatCurrencyAmount, formatSignedCurrencyAmount, getCurrencyExponent } from "../currency";

/**
 * Format a minor unit integer monetary amount (e.g. 1550 USD -> $15.50).
 */
export function formatCurrency(
  minorAmount: bigint | number,
  currencyCode = "USD",
  locale = "en-US",
): string {
  return formatCurrencyAmount(minorAmount, currencyCode, locale);
}

/**
 * Format a minor unit amount with explicit sign prefix (+/-).
 */
export function formatSignedCurrency(
  minorAmount: bigint | number,
  type: "income" | "expense",
  currencyCode = "USD",
  locale = "en-US",
): string {
  return formatSignedCurrencyAmount(minorAmount, type, currencyCode, locale);
}

/**
 * Format a decimal major unit amount (e.g. 15.5 USD -> $15.50).
 */
export function formatMajorCurrency(
  majorAmount: number,
  currencyCode = "USD",
  locale = "en-US",
): string {
  const exponent = getCurrencyExponent(currencyCode);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: exponent,
    maximumFractionDigits: exponent,
  }).format(majorAmount);
}

/**
 * Format a decimal major unit amount with +/- sign.
 */
export function formatSignedMajorCurrency(
  majorAmount: number,
  currencyCode = "USD",
  locale = "en-US",
): string {
  const formatted = formatMajorCurrency(Math.abs(majorAmount), currencyCode, locale);
  if (majorAmount > 0) return `+${formatted}`;
  if (majorAmount < 0) return `-${formatted}`;
  return formatted;
}
