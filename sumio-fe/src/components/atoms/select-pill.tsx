import type { OnChange, SelectOption as CommonSelectOption } from "@sumio/common";
import type { ReactNode } from "react";

import { cn } from "./cn";
import { ListBox } from "./list-box";
import { Select } from "./select";

export type SelectOption<T = string | number> = CommonSelectOption<T, ReactNode>;

export interface SelectPillProps {
  ariaLabel: string;
  options: SelectOption[];
  value: string;
  onChange: OnChange<string>;
  className?: string;
  icon?: ReactNode;
  isActive?: boolean;
}

/** Compact HeroUI Select used in card headers and toolbars. */
export function SelectPill({
  ariaLabel,
  options,
  value,
  onChange,
  className,
  icon,
  isActive,
}: SelectPillProps) {
  return (
    <Select
      aria-label={ariaLabel}
      variant="secondary"
      className={className ?? "w-32"}
      value={value}
      onChange={(key) => {
        if (key !== null) onChange(String(key));
      }}
    >
      <Select.Trigger
        className={cn(
          "flex min-h-10 sm:min-h-8 sm:h-8 items-center gap-1.5 rounded-lg border px-3 sm:px-2.5 text-base sm:text-xs font-medium shadow-xs transition-all cursor-pointer select-none",
          isActive
            ? "border-accent/40 bg-accent-subtle/70 font-semibold text-accent"
            : "border-border/70 bg-surface text-foreground/80 hover:border-border hover:bg-surface-secondary/60 hover:text-foreground",
        )}
      >
        {icon && (
          <span className={cn("shrink-0", isActive ? "text-accent" : "text-muted")}>{icon}</span>
        )}
        <Select.Value className="truncate" />
        <Select.Indicator className={cn("shrink-0", isActive ? "text-accent" : "text-muted")} />
      </Select.Trigger>
      <Select.Popover className="bg-overlay text-foreground border-border z-50 min-w-[140px] rounded-lg border p-1 shadow-md">
        <ListBox className="gap-0.5 p-0">
          {options.map((o) => (
            <ListBox.Item
              key={o.id}
              id={o.id}
              textValue={o.label}
              className="hover:bg-surface-secondary text-foreground data-selected:text-accent flex min-h-10 cursor-pointer items-center justify-between rounded-md px-3 py-2 text-base data-selected:font-semibold sm:min-h-8 sm:px-2.5 sm:py-1.5 sm:text-xs"
            >
              <div className="flex items-center gap-2">
                {o.icon}
                <span>{o.label}</span>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
