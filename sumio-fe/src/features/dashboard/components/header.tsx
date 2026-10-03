import { Bell, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, Input } from "@/components/ui";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 py-2">
      {/* Search Bar */}
      <div className="relative max-w-md flex-1">
        <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          placeholder="Search transaction, category, note..."
          className="border-border bg-surface text-foreground placeholder:text-muted shadow-field focus:border-focus h-10 w-full rounded-2xl pr-12 pl-9 text-xs transition-all"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <kbd className="border-border bg-surface-secondary text-muted inline-flex h-5 items-center rounded-md border px-1.5 font-mono text-[10px] font-medium">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="border-border bg-surface text-muted shadow-surface hover:bg-surface-secondary hover:text-foreground relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border transition-all active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="bg-danger ring-surface absolute top-2.5 right-2.5 h-2 w-2 rounded-full ring-2" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="ring-accent/30 h-10 w-10 ring-2">
            <AvatarImage
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Summer"
            />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-foreground text-xs leading-tight font-bold">Summer</p>
            <p className="text-muted text-[11px]">Personal Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
