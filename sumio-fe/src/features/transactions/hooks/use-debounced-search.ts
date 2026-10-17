import { useState } from "react";

import type { OnChange } from "@sumio/common";

import { useDebouncedCallback } from "@/lib/hooks/use-debounced-callback";

export function useDebouncedSearch(
  initialValue: string,
  onDebounce: OnChange<string>,
  delay = 300,
): readonly [string, OnChange<string>] {
  const [value, setValue] = useState(initialValue);
  const [prevInitial, setPrevInitial] = useState(initialValue);

  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  const debouncedOnSearch = useDebouncedCallback(onDebounce, delay);

  const handleChange = (newValue: string): void => {
    setValue(newValue);
    debouncedOnSearch(newValue);
  };

  return [value, handleChange] as const;
}
