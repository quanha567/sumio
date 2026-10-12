import type { ReactNode } from "react";

import { cn, SearchField } from "@/components/ui";

export interface SearchFilterBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function SearchFilterBar({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  filters,
  actions,
  className,
}: SearchFilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchField
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full"
          />
        </div>

        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </div>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
