import type { PaginatedResult, PaginationMetadata, PaginationParams } from "../types/common.types";

export interface PaginationOptions {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

/**
 * Normalizes page and pageSize input parameters and computes offset (skip) and limit (take).
 */
export function calculatePagination(
  params?: PaginationParams,
  defaultPageSize = 20,
  maxPageSize = 100,
): PaginationOptions {
  const page = Math.max(1, Math.floor(params?.page ?? 1));
  const rawPageSize = Math.max(1, Math.floor(params?.pageSize ?? defaultPageSize));
  const pageSize = Math.min(rawPageSize, maxPageSize);
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { page, pageSize, skip, take };
}

/**
 * Wraps items and total count into a standard PaginatedResult object.
 */
export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    pageSize,
  };
}

/**
 * Calculates complete pagination metadata including navigation flags.
 */
export function calculatePaginationMetadata(
  total: number,
  page: number,
  pageSize: number,
): PaginationMetadata {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
