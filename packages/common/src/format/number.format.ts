/**
 * Formats a number with locale-aware grouping and decimals.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = "en-US",
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Formats a ratio as percentage (e.g. 0.155 -> "15.5%" or 0.85 -> "85%").
 */
export function formatPercent(value: number, decimals = 0, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number using compact notation (e.g. 1500 -> "1.5K", 2500000 -> "2.5M").
 */
export function formatCompactNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}
