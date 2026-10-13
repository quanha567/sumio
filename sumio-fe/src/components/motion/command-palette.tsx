import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { searchCommands } from "@/lib/command-search";
import { useTouchCapable } from "@/lib/hooks/use-touch-capable";

import { CommandDialogPanel, EASE_OUT } from "./command-palette-list";
import { PresenceGate } from "./presence-gate";

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: React.ComponentType<{ className?: string }>;
  hint?: string;
  badge?: ReactNode;
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandPaletteProps {
  items: CommandItem[];
  shortcut?: string;
  placeholder?: string;
  emptyMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const emptySubscribe = () => () => {};

function getNextRowIndex(currentIndex: number, delta: number, total: number): number {
  if (currentIndex === -1) {
    if (delta > 0) return 0;
    return total - 1;
  }
  return (currentIndex + delta + total) % total;
}

function useRowCursor(rows: CommandItem[], query: string) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [prevQuery, setPrevQuery] = useState(query);

  if (prevQuery !== query) {
    setPrevQuery(query);
    setActiveId(null);
  }

  const activeIndex = useMemo(() => {
    if (rows.length === 0) return -1;
    if (activeId === null) return 0;
    const found = rows.findIndex((it) => it.id === activeId);
    return found === -1 ? 0 : found;
  }, [rows, activeId]);

  const moveTo = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  const moveActive = useCallback(
    (delta: number) => {
      if (rows.length === 0) return;
      const nextIndex = getNextRowIndex(activeIndex, delta, rows.length);
      setActiveId(rows[nextIndex]?.id ?? null);
    },
    [rows, activeIndex],
  );

  return { activeIndex, moveTo, moveActive };
}

function useOnOpen(open: boolean, callback: () => void) {
  const previousOpen = useRef(open);
  useEffect(() => {
    if (open && !previousOpen.current) {
      callback();
    }
    previousOpen.current = open;
  }, [open, callback]);
}

function useCommandShortcut(open: boolean, shortcut: string, setOpen: (v: boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcut.toLowerCase()) {
        e.preventDefault();
        setOpen(!open);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, shortcut, setOpen]);
}

function useBodyScrollLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);
}

function useCommandPaletteManager(opts: CommandPaletteProps) {
  const { items, shortcut = "k", open: controlledOpen, onOpenChange } = opts;
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = controlledOpen !== undefined;
  const open = controlled ? controlledOpen : internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (!controlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [controlled, onOpenChange],
  );

  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useCommandShortcut(open, shortcut, setOpen);
  useBodyScrollLock(open);

  const filtered = useMemo(() => searchCommands(items, query), [items, query]);
  const hasIcons = useMemo(() => items.some((it) => it.icon), [items]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((it) => {
      const g = it.group ?? "Results";
      const groupItems = map.get(g) ?? [];
      groupItems.push(it);
      map.set(g, groupItems);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const rows = useMemo(() => grouped.flatMap(([, list]) => list), [grouped]);
  const { activeIndex: active, moveTo, moveActive } = useRowCursor(rows, query);

  useOnOpen(open, () => {
    setQuery("");
    moveTo(null);
  });

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLButtonElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = rows[active];
      if (it) {
        it.onSelect();
        setOpen(false);
      }
    }
  };

  return {
    open,
    setOpen,
    query,
    setQuery,
    inputRef,
    listRef,
    hasIcons,
    grouped,
    rows,
    active,
    moveTo,
    onKeyDown,
  };
}

export function CommandPalette(props: CommandPaletteProps) {
  const { placeholder = "Type a command or search…", emptyMessage = "No results found." } = props;
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const uid = useId();
  const canTouch = useTouchCapable();

  const {
    open,
    setOpen,
    query,
    setQuery,
    inputRef,
    listRef,
    hasIcons,
    grouped,
    rows,
    active,
    moveTo,
    onKeyDown,
  } = useCommandPaletteManager(props);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false}>
      {open ? (
        <PresenceGate key="backdrop">
          {({ gate }) => (
            <motion.button
              type="button"
              aria-label="Close command palette"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              {...gate}
              onClick={() => setOpen(false)}
              className="bg-background/5 pointer-events-auto fixed inset-0 z-[100] [backdrop-filter:blur(12px)_saturate(140%)] [-webkit-backdrop-filter:blur(12px)_saturate(140%)]"
            />
          )}
        </PresenceGate>
      ) : null}

      {open ? (
        <PresenceGate key="panel-layer">
          {({ isPresent, gate }) => (
            <div
              inert={!isPresent}
              className="pointer-events-none fixed inset-x-4 top-[18vh] bottom-4 z-[100] flex items-start justify-center"
            >
              <CommandDialogPanel
                inputRef={inputRef}
                listRef={listRef}
                query={query}
                setQuery={setQuery}
                placeholder={placeholder}
                uid={uid}
                rows={rows}
                active={active}
                grouped={grouped}
                emptyMessage={emptyMessage}
                hasIcons={hasIcons}
                reduce={null}
                canTouch={canTouch}
                onKeyDown={onKeyDown}
                moveTo={moveTo}
                onSelectRow={(it) => {
                  it.onSelect();
                  setOpen(false);
                }}
                gate={gate}
              />
            </div>
          )}
        </PresenceGate>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
