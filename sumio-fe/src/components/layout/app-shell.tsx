import type { ReactNode } from "react";

import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";
import { Topbar, type TopbarUser } from "./topbar";

interface AppShellProps {
  user: TopbarUser;
  children: ReactNode;
}

/** Page chrome shared by every authenticated page: sidebar + topbar + content slot. */
export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen w-full">
      <div className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto px-4 py-6 lg:block xl:w-64">
        <Sidebar />
      </div>
      <main className="min-w-0 flex-1 space-y-5 px-4 pt-5 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <Topbar user={user} />
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
