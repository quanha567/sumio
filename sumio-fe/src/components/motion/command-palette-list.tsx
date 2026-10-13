import { Search } from "lucide-react";
import { motion } from "motion/react";
import type { RefObject } from "react";

import { cn } from "@/lib/utils";

import type { CommandItem } from "./command-palette";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const PANEL_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_ACTIVE_NAV = {
  type: "spring",
  stiffness: 480,
  damping: 38,
} as const;

export function renderCommandIcon(
  Icon: React.ComponentType<{ className?: string }> | undefined,
  hasIcons: boolean,
  isActive: boolean,
) {
  if (Icon) {
    return (
      <Icon
        className={cn(
          "relative z-10 size-4 shrink-0 transition-colors",
          isActive ? "text-accent" : "text-muted",
        )}
      />
    );
  }
  if (hasIcons) {
    return <span className="relative z-10 size-4 shrink-0" />;
  }
  return null;
}

export interface CommandPaletteListProps {
  listRef: RefObject<HTMLDivElement | null>;
  uid: string;
  rows: CommandItem[];
  grouped: [string, CommandItem[]][];
  active: number;
  emptyMessage: string;
  hasIcons: boolean;
  reduce: boolean | null;
  onSelectRow: (it: CommandItem) => void;
  moveTo: (id: string | null) => void;
}

export function CommandPaletteList({
  listRef,
  uid,
  rows,
  grouped,
  active,
  emptyMessage,
  hasIcons,
  reduce,
  onSelectRow,
  moveTo,
}: CommandPaletteListProps) {
  if (rows.length === 0) {
    return (
      <div
        ref={listRef}
        id={`${uid}-list`}
        role="listbox"
        aria-label="Commands"
        className="max-h-[60vh] [scrollbar-width:none] overflow-y-auto p-2"
      >
        <div className="text-muted p-8 text-center text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      id={`${uid}-list`}
      role="listbox"
      aria-label="Commands"
      className="max-h-[60vh] [scrollbar-width:none] overflow-y-auto overscroll-contain p-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {grouped.map(([group, list]) => (
        <div key={group} className="mb-1 last:mb-0">
          <div
            aria-hidden
            className="text-muted px-2 py-1.5 text-[10px] font-semibold tracking-wider uppercase"
          >
            {group}
          </div>
          {list.map((it) => {
            const idx = rows.indexOf(it);
            const isActive = idx === active;
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                type="button"
                id={`${uid}-opt-${idx}`}
                role="option"
                aria-selected={isActive}
                data-index={idx}
                onMouseEnter={() => moveTo(it.id)}
                onClick={() => onSelectRow(it)}
                className={cn(
                  "relative isolate flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer",
                  isActive ? "text-accent font-medium" : "text-muted hover:text-foreground",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId={`${uid}-active`}
                    className="bg-accent-subtle absolute inset-0 z-0 rounded-xl"
                    transition={reduce ? { duration: 0 } : SPRING_ACTIVE_NAV}
                  />
                ) : null}
                {renderCommandIcon(Icon, hasIcons, isActive)}
                <span className="relative z-10 flex-1 truncate">{it.label}</span>
                {it.badge ? <span className="relative z-10 shrink-0">{it.badge}</span> : null}
                {it.hint ? (
                  <kbd className="border-border bg-surface text-muted relative z-10 rounded border px-1.5 py-0.5 text-[10px]">
                    {it.hint}
                  </kbd>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export interface CommandDialogPanelProps {
  inputRef: RefObject<HTMLInputElement | null>;
  listRef: RefObject<HTMLDivElement | null>;
  query: string;
  setQuery: (val: string) => void;
  placeholder: string;
  uid: string;
  rows: CommandItem[];
  active: number;
  grouped: [string, CommandItem[]][];
  emptyMessage: string;
  hasIcons: boolean;
  reduce: boolean | null;
  canTouch: boolean;
  onKeyDown: (e: React.KeyboardEvent) => void;
  moveTo: (id: string | null) => void;
  onSelectRow: (it: CommandItem) => void;
  gate: Record<string, unknown>;
}

export function CommandDialogPanel({
  inputRef,
  listRef,
  query,
  setQuery,
  placeholder,
  uid,
  rows,
  active,
  grouped,
  emptyMessage,
  hasIcons,
  reduce,
  canTouch,
  onKeyDown,
  moveTo,
  onSelectRow,
  gate,
}: CommandDialogPanelProps) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      initial={{ opacity: 0, y: reduce ? 0 : -8, scale: reduce ? 1 : 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        y: reduce ? 0 : -8,
        scale: reduce ? 1 : 0.97,
        transition: { duration: 0.12, ease: EASE_OUT },
      }}
      transition={reduce ? { duration: 0.1 } : PANEL_SPRING}
      {...gate}
      onKeyDown={onKeyDown}
      className="border-border bg-surface pointer-events-auto w-full max-w-xl overflow-hidden rounded-2xl border shadow-2xl will-change-transform"
    >
      <div className="border-border flex items-center gap-3 border-b px-4">
        <Search className="text-muted size-4 shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls={`${uid}-list`}
          aria-activedescendant={rows.length > 0 ? `${uid}-opt-${active}` : undefined}
          aria-autocomplete="list"
          className={cn(
            "h-12 flex-1 border-none bg-transparent text-sm text-foreground placeholder:text-muted shadow-none ring-0 outline-none",
            "focus:border-none focus:outline-none focus:ring-0 focus-visible:!outline-none focus-visible:!ring-0",
            canTouch && "text-base",
          )}
        />
        <kbd className="border-border bg-surface-secondary text-muted hidden rounded border px-1.5 py-0.5 text-[10px] sm:inline-block">
          ESC
        </kbd>
      </div>

      <CommandPaletteList
        listRef={listRef}
        uid={uid}
        rows={rows}
        grouped={grouped}
        active={active}
        emptyMessage={emptyMessage}
        hasIcons={hasIcons}
        reduce={reduce}
        moveTo={moveTo}
        onSelectRow={onSelectRow}
      />
    </motion.div>
  );
}
