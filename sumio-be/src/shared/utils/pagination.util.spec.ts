import { describe, expect, it } from "vitest";

import {
  buildPaginatedResult,
  calculatePagination,
  calculatePaginationMetadata,
} from "./pagination.util";

describe("pagination.util", () => {
  it("should calculate default pagination options", () => {
    const result = calculatePagination();
    expect(result).toEqual({
      page: 1,
      pageSize: 20,
      skip: 0,
      take: 20,
    });
  });

  it("should calculate custom pagination and respect maxPageSize", () => {
    const result = calculatePagination({ page: 3, pageSize: 250 }, 20, 100);
    expect(result).toEqual({
      page: 3,
      pageSize: 100,
      skip: 200,
      take: 100,
    });
  });

  it("should build paginated result correctly", () => {
    const items = ["a", "b", "c"];
    const result = buildPaginatedResult(items, 10, 1, 3);
    expect(result).toEqual({
      items,
      total: 10,
      page: 1,
      pageSize: 3,
    });
  });

  it("should calculate pagination metadata with navigation flags", () => {
    const meta = calculatePaginationMetadata(55, 2, 20);
    expect(meta).toEqual({
      page: 2,
      pageSize: 20,
      total: 55,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: true,
    });
  });
});
