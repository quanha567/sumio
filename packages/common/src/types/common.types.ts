export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

export type AsyncResult<T, E = Error> = Promise<
  { success: true; data: T } | { success: false; error: E }
>;

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMetadata {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuditTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

export type Dictionary<T = unknown> = Record<string, T>;

export type NonEmptyArray<T> = [T, ...T[]];

export type ValueOrPromise<T> = T | Promise<T>;

export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

export type Predicate<T> = (value: T) => boolean;

export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends (...args: unknown[]) => unknown
    ? T
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

export type SortDirection = "asc" | "desc";

export interface SortParams<TKey extends string = string> {
  sortBy?: TKey;
  sortOrder?: SortDirection;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface CategoryBreakdown {
  name: string;
  amount: number;
}
