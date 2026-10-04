import { cn } from "@heroui/react";
import { Link } from "@tanstack/react-router";

import { navItems } from "./nav-items";

/** Mobile Bottom Navigation Bar (anchored at viewport base on < 1024px). */
export function BottomNav() {
  // Use first 5 items for mobile bottom bar
  const items = navItems.slice(0, 5);

  return (
    <nav
      aria-label="Mobile navigation"
      className="bg-surface/95 border-border fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.to === "/";

          const content = (
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 transition-colors",
                isActive ? "text-accent" : "text-muted hover:text-foreground",
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-12 items-center justify-center rounded-full transition-all",
                  isActive && "bg-accent/15",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] leading-tight font-medium">{item.label}</span>
            </div>
          );

          if (item.to) {
            return (
              <Link key={item.id} to={item.to} className="flex-1">
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              disabled
              className="flex-1 cursor-not-allowed opacity-50"
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
