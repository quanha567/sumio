import { describe, expect, it } from "bun:test";

import {
  dayjs,
  endOfDayUtc,
  esToolkit,
  formatCompactNumber,
  formatCurrencyAmount,
  formatDate,
  formatDateTime,
  formatMajorCurrencyAmount,
  formatNumber,
  formatPercent,
  formatSignedCurrencyAmount,
  formatSignedMajorCurrencyAmount,
  formatTime,
  generateId,
  getCurrencyExponent,
  lodash,
  startOfDayUtc,
  toMajorUnits,
  toMinorUnits,
  toUtcIsoString,
} from "./index";

describe("@sumio/common", () => {
  describe("date utilities", () => {
    it("should format dates using dayjs", () => {
      const formatted = formatDate("2026-03-01", "DD/MM/YYYY");
      expect(formatted).toBe("01/03/2026");
    });

    it("should calculate UTC start and end of day", () => {
      const start = startOfDayUtc("2026-03-01T15:30:00Z");
      expect(start.toISOString()).toBe("2026-03-01T00:00:00.000Z");

      const end = endOfDayUtc("2026-03-01T15:30:00Z");
      expect(end.toISOString()).toBe("2026-03-01T23:59:59.999Z");
    });

    it("should convert to UTC ISO string", () => {
      const iso = toUtcIsoString("2026-03-01T12:00:00Z");
      expect(iso).toBe("2026-03-01T12:00:00.000Z");
    });

    it("should format dates and times correctly", () => {
      expect(formatDateTime("2026-03-01T14:30:00", "YYYY-MM-DD HH:mm")).toBe("2026-03-01 14:30");
      expect(formatTime("2026-03-01T14:30:00", "HH:mm")).toBe("14:30");
    });
  });

  describe("currency utilities", () => {
    it("should correctly convert between minor and major units", () => {
      expect(getCurrencyExponent("VND")).toBe(0);
      expect(toMinorUnits(50000, "VND")).toBe(50000n);
      expect(toMajorUnits(50000n, "VND")).toBe(50000);

      expect(getCurrencyExponent("USD")).toBe(2);
      expect(toMinorUnits(15.5, "USD")).toBe(1550n);
      expect(toMajorUnits(1550n, "USD")).toBe(15.5);
    });

    it("should format minor unit currencies (unsigned and signed)", () => {
      const usd = formatCurrencyAmount(1250, "USD", "en-US");
      expect(usd).toContain("12.50");

      const vnd = formatCurrencyAmount(50000, "VND", "vi-VN");
      expect(vnd).toContain("50.000");

      const income = formatSignedCurrencyAmount(1250, "income", "USD", "en-US");
      expect(income.startsWith("+")).toBe(true);

      const expense = formatSignedCurrencyAmount(50000, "expense", "VND", "vi-VN");
      expect(expense.startsWith("-")).toBe(true);
    });

    it("should format major unit currencies (unsigned and signed)", () => {
      const usd = formatMajorCurrencyAmount(12.5, "USD", "en-US");
      expect(usd).toContain("12.50");

      const signedPos = formatSignedMajorCurrencyAmount(12.5, "USD", "en-US");
      expect(signedPos.startsWith("+")).toBe(true);

      const signedNeg = formatSignedMajorCurrencyAmount(-50, "USD", "en-US");
      expect(signedNeg.startsWith("-")).toBe(true);
    });
  });

  describe("number formatters", () => {
    it("should format numbers and percents correctly", () => {
      expect(formatNumber(1234567.89, { maximumFractionDigits: 2 }, "en-US")).toBe("1,234,567.89");
      expect(formatPercent(0.155, 1, "en-US")).toBe("15.5%");
      expect(formatCompactNumber(1500, "en-US")).toBe("1.5K");
    });
  });

  describe("nanoid", () => {
    it("should generate 12-char url-safe ID", () => {
      const id = generateId();
      expect(id).toHaveLength(12);
      expect(/^[0-9a-z]{12}$/.test(id)).toBe(true);
    });
  });

  describe("libraries re-export", () => {
    it("should have dayjs configured", () => {
      expect(dayjs).toBeDefined();
      expect(typeof dayjs.utc).toBe("function");
    });

    it("should have es-toolkit and lodash available", () => {
      expect(typeof esToolkit.chunk).toBe("function");
      expect(typeof lodash.groupBy).toBe("function");
    });
  });
});
