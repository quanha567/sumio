/**
 * Date and time utilities for standardized UTC manipulations across backend modules.
 */

/**
 * Ensures a Date or date string is converted to ISO 8601 UTC string.
 */
export function toUtcIsoString(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) {
    throw new TypeError(`Invalid date provided: ${date}`);
  }
  return d.toISOString();
}

/**
 * Returns a new Date object representing the beginning of the UTC day (00:00:00.000Z).
 */
export function startOfDayUtc(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Returns a new Date object representing the end of the UTC day (23:59:59.999Z).
 */
export function endOfDayUtc(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
}

/**
 * Validates if a string is a valid ISO 8601 date.
 */
export function isValidIsoDate(value: unknown): boolean {
  if (typeof value !== "string" || !value) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(value.slice(0, 10));
}
