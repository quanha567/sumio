import { useEffect, useState } from "react";

export function useDebouncedSearch(
  initialValue: string,
  onDebounce: (value: string) => void,
  delay = 300,
) {
  const [value, setValue] = useState(initialValue);
  const [prevInitial, setPrevInitial] = useState(initialValue);

  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      onDebounce(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onDebounce]);

  return [value, setValue] as const;
}
