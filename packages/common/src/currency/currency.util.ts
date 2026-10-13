/**
 * Utilities for handling monetary amounts as integer minor units per ISO 4217
 * as defined in ADR 0006.
 */

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);
const THREE_DECIMAL_CURRENCIES = new Set(["BHD", "IQD", "JOD", "KWD", "OMR", "TND"]);

export function getCurrencyExponent(currencyCode: string): number {
  const code = currencyCode.toUpperCase();
  if (ZERO_DECIMAL_CURRENCIES.has(code)) {
    return 0;
  }
  if (THREE_DECIMAL_CURRENCIES.has(code)) {
    return 3;
  }
  return 2;
}

export function toMinorUnits(majorAmount: number, currencyCode: string): bigint {
  const exponent = getCurrencyExponent(currencyCode);
  const factor = 10 ** exponent;
  return BigInt(Math.round(majorAmount * factor));
}

export function toMajorUnits(minorAmount: bigint | number, currencyCode: string): number {
  const exponent = getCurrencyExponent(currencyCode);
  const factor = 10 ** exponent;
  return Number(minorAmount) / factor;
}

export function formatCurrencyAmount(
  minorAmount: bigint | number,
  currencyCode: string,
  locale = "en-US",
): string {
  const major = toMajorUnits(minorAmount, currencyCode);
  const exponent = getCurrencyExponent(currencyCode);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: exponent,
    maximumFractionDigits: exponent,
  }).format(major);
}

export function formatSignedCurrencyAmount(
  minorAmount: bigint | number,
  type: "income" | "expense",
  currencyCode: string,
  locale = "en-US",
): string {
  const formatted = formatCurrencyAmount(minorAmount, currencyCode, locale);
  return type === "income" ? `+${formatted}` : `-${formatted}`;
}
