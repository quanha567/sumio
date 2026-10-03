import { Card } from "@/components/ui/card";

import type { ResourceLink } from "../types";

export function ResourceCard({ resource }: { resource: ResourceLink }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noreferrer"
      aria-label={resource.title}
      className="group block rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:outline-none"
    >
      <Card className="h-full transition-all group-hover:border-indigo-500/40 group-hover:bg-slate-900/80">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="flex items-center gap-1.5 font-semibold text-white transition-colors group-hover:text-indigo-300">
            {resource.title}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              &rarr;
            </span>
          </h4>
          {resource.badge ? (
            <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
              {resource.badge}
            </span>
          ) : null}
        </div>
        <p className="text-xs leading-relaxed text-slate-400">{resource.description}</p>
      </Card>
    </a>
  );
}
