import { describe, expect, it } from "bun:test";

import {
  dayjs,
  endOfDayUtc,
  esToolkit,
  formatDate,
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
