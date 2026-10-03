import type { TechItem } from "../types";

export function TechStackBadge({ item }: { item: TechItem }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/80 p-3.5 transition-colors hover:border-slate-700">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-100">{item.name}</span>
          <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 font-mono text-xs text-indigo-400">
            {item.version}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-400">{item.description}</p>
      </div>
    </div>
  );
}
