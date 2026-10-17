import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart2,
  LayoutDashboard,
  PiggyBank,
  Plus,
  Settings,
  Target,
} from "lucide-react";
import { createContext, type ReactNode, use, useCallback, useMemo, useState } from "react";

import { CommandPalette } from "@/components/motion/command-palette";
import type { CommandItem } from "@/components/motion/command-palette";

export interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = use(CommandPaletteContext);

  if (!ctx) {
    throw new Error("useCommandPalette must be used inside CommandPaletteProvider");
  }

  return ctx;
}

interface CommandPaletteProviderProps {
  children: ReactNode;
}

export function CommandPaletteProvider({ children }: CommandPaletteProviderProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = useCallback((v: boolean) => setOpen(v), []);

  const items: CommandItem[] = [
    {
      id: "nav-dashboard",
      label: "Dashboard",
      group: "Navigate",
      icon: LayoutDashboard,
      keywords: ["home", "overview", "summary"],
      onSelect: () => {
        void navigate({ to: "/" });
        setOpen(false);
      },
    },
    {
      id: "nav-transactions",
      label: "Transactions",
      group: "Navigate",
      icon: ArrowLeftRight,
      keywords: ["payments", "history", "ledger"],
      onSelect: () => {
        void navigate({
          to: "/transactions",
          search: {
            page: 1,
            type: "all",
            categoryId: "all",
            date: "all",
            q: "",
          },
        });

        setOpen(false);
      },
    },
    {
      id: "nav-budgets",
      label: "Budgets",
      group: "Navigate",
      icon: PiggyBank,
      keywords: ["spending", "limits", "envelope"],
      onSelect: () => setOpen(false),
    },
    {
      id: "nav-goals",
      label: "Goals",
      group: "Navigate",
      icon: Target,
      keywords: ["savings", "targets", "milestones"],
      onSelect: () => setOpen(false),
    },
    {
      id: "nav-reports",
      label: "Reports",
      group: "Navigate",
      icon: BarChart2,
      keywords: ["analytics", "charts", "insights"],
      onSelect: () => setOpen(false),
    },
    {
      id: "nav-settings",
      label: "Settings",
      group: "Navigate",
      icon: Settings,
      keywords: ["preferences", "account", "profile"],
      onSelect: () => setOpen(false),
    },
    {
      id: "action-new-transaction",
      label: "New Transaction",
      group: "Actions",
      icon: Plus,
      hint: "Record income or expense",
      keywords: ["add", "create", "record", "income", "expense"],
      onSelect: () => setOpen(false),
    },
  ];

  const contextValue = useMemo(() => ({ open, setOpen: handleOpen }), [open, handleOpen]);

  return (
    <CommandPaletteContext value={contextValue}>
      {children}
      <CommandPalette
        items={items}
        open={open}
        onOpenChange={handleOpen}
        placeholder="Search pages and actions…"
      />
    </CommandPaletteContext>
  );
}
