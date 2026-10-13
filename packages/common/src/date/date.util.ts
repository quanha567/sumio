import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

// Initialize standard plugins once
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(relativeTime);

export { dayjs };

export type DateInput = Date | string | number | dayjs.Dayjs;

/**
 * Returns an ISO 8601 UTC string (e.g. 2026-03-01T00:00:00.000Z).
 */
export function toUtcIsoString(date: DateInput): string {
  const d = dayjs.utc(date);
  if (!d.isValid()) {
    throw new TypeError(`Invalid date input: ${String(date)}`);
  }
  return d.toISOString();
}

/**
 * Formats a date using a custom pattern (default: YYYY-MM-DD).
 */
export function formatDate(date: DateInput, pattern = "YYYY-MM-DD"): string {
  return dayjs(date).format(pattern);
}

/**
 * Formats a date and time using a custom pattern (default: YYYY-MM-DD HH:mm:ss).
 */
export function formatDateTime(date: DateInput, pattern = "YYYY-MM-DD HH:mm:ss"): string {
  return dayjs(date).format(pattern);
}

/**
 * Formats a time using a custom pattern (default: HH:mm).
 */
export function formatTime(date: DateInput, pattern = "HH:mm"): string {
  return dayjs(date).format(pattern);
}

/**
 * Returns a native Date representing the start of the UTC day (00:00:00.000Z).
 */
export function startOfDayUtc(date: DateInput): Date {
  return dayjs.utc(date).startOf("day").toDate();
}

/**
 * Returns a native Date representing the end of the UTC day (23:59:59.999Z).
 */
export function endOfDayUtc(date: DateInput): Date {
  return dayjs.utc(date).endOf("day").toDate();
}

/**
 * Returns relative human-readable time from now (e.g. "3 hours ago", "in 2 days").
 */
export function fromNow(date: DateInput): string {
  return dayjs(date).fromNow();
}
