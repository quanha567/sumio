import type { DateInput } from "../date";
import { dayjs } from "../date";

/**
 * Standard date pattern format (default: YYYY-MM-DD).
 */
export function formatDate(date: DateInput, pattern = "YYYY-MM-DD"): string {
  return dayjs(date).format(pattern);
}

/**
 * Standard date and time format (default: YYYY-MM-DD HH:mm:ss).
 */
export function formatDateTime(date: DateInput, pattern = "YYYY-MM-DD HH:mm:ss"): string {
  return dayjs(date).format(pattern);
}

/**
 * Standard time-only format (default: HH:mm).
 */
export function formatTime(date: DateInput, pattern = "HH:mm"): string {
  return dayjs(date).format(pattern);
}

/**
 * Relative human time from now (e.g. "3 hours ago", "in 2 days").
 */
export function formatRelativeTime(date: DateInput): string {
  return dayjs(date).fromNow();
}

/**
 * Locale-sensitive date formatting using Intl.DateTimeFormat.
 */
export function formatLocalizedDate(
  date: DateInput,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
  locale = "en-US",
): string {
  const d = date instanceof Date ? date : dayjs(date).toDate();
  return new Intl.DateTimeFormat(locale, options).format(d);
}
