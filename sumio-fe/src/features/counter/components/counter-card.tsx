import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { useCounter } from "../hooks/use-counter";

export function CounterCard() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <Card className="mx-auto max-w-md border-indigo-500/20 bg-gradient-to-b from-slate-900 to-slate-950 text-center">
      <div className="mb-4">
        <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
          Interactive State
        </span>
        <h3 className="mt-1 text-xl font-bold text-white">React 19 Counter Feature</h3>
        <p className="mt-1 text-sm text-slate-400">
          Refactored from vanilla <code>counter.ts</code> to a type-safe feature module.
        </p>
      </div>

      <div className="py-6">
        <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-6xl font-extrabold text-transparent">
          {count}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="md" onClick={decrement} aria-label="Decrement counter">
          - 1
        </Button>
        <Button variant="primary" size="md" onClick={increment} aria-label="Increment counter">
          + 1
        </Button>
        <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset counter">
          Reset
        </Button>
      </div>
    </Card>
  );
}
