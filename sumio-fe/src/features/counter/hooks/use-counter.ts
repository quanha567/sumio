import { useState } from "react";

import type { CounterState } from "../types";

export function useCounter(initialValue: number = 0): CounterState {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}
