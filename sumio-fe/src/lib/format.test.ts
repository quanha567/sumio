import { describe, expect, it } from "vite-plus/test";

import { formatMoney, formatSignedMoney, majorUnitsToMinor, minorUnitsToMajor } from "./format";

describe("formatMoney & minor units (ADR 0006)", () => {
  it("converts USD major to minor and back (exponent 2)", () => {
    expect(majorUnitsToMinor(12.5, "USD")).toBe(1250);
    expect(minorUnitsToMajor(1250, "USD")).toBe(12.5);
  });

  it("converts VND major to minor and back (exponent 0)", () => {
    expect(majorUnitsToMinor(50000, "VND")).toBe(50000);
    expect(minorUnitsToMajor(50000, "VND")).toBe(50000);
  });

  it("converts JPY major to minor and back (exponent 0)", () => {
    expect(majorUnitsToMinor(1000, "JPY")).toBe(1000);
    expect(minorUnitsToMajor(1000, "JPY")).toBe(1000);
  });

  it("formats unsigned money correctly according to currency", () => {
    const usd = formatMoney(1250, "USD", "en-US");
    expect(usd).toContain("12.50");

    const vnd = formatMoney(50000, "VND", "vi-VN");
    expect(vnd).toContain("50.000");
  });

  it("formats signed money with appropriate sign (+/-)", () => {
    const income = formatSignedMoney(1250, "income", { currency: "USD", locale: "en-US" });
    expect(income.startsWith("+")).toBe(true);

    const expense = formatSignedMoney(50000, "expense", { currency: "VND", locale: "vi-VN" });
    expect(expense.startsWith("-")).toBe(true);
  });
});
