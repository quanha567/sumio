import type { ReactNode } from "react";

import type { AsyncVoidFunction, VoidFunction } from "@sumio/common";

import {
  AnimatedSidebarInset,
  AnimatedSidebarProvider,
} from "@/components/motion/animated-sidebar";

import { BottomNav } from "./bottom-nav";
import { CommandPaletteProvider } from "./command-palette-provider";
import { NavSidebar } from "./sidebar";
import { Topbar, type TopbarUser } from "./topbar";

interface AppShellProps {
  user: TopbarUser;
  onLogout?: VoidFunction | AsyncVoidFunction;
  children: ReactNode;
}

/** Authenticated page chrome: animated sidebar + sticky topbar + command palette. */
export function AppShell({ user, onLogout, children }: AppShellProps) {
  return (
    <CommandPaletteProvider>
      <AnimatedSidebarProvider>
        <NavSidebar onLogout={onLogout} />

        <AnimatedSidebarInset className="bg-background">
          <Topbar user={user} onLogout={onLogout} />

          <main className="min-w-0 flex-1 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:pb-8">{children}</main>
        </AnimatedSidebarInset>

        <BottomNav />
      </AnimatedSidebarProvider>
    </CommandPaletteProvider>
  );
}
