import { useEffect, useMemo } from "react";

import { debounce, type VoidFunction } from "@sumio/common";

export interface DebouncedCallbackOptions {
  leading?: boolean;
  maxWait?: number;
  trailing?: boolean;
}

export interface DebouncedFunction<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: VoidFunction;
  flush: VoidFunction;
}

/**
 * Creates a debounced version of the provided callback function using lodash-es debounce.
 * Cleans up automatically on component unmount or when dependencies change.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 300,
  options?: DebouncedCallbackOptions,
): DebouncedFunction<TArgs> {
  const debounced = useMemo(() => {
    return debounce(callback, delay, options);
  }, [callback, delay, options]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
}
