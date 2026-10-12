import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";

import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

import { navItems } from "./nav-items";

/** Mobile Bottom Navigation Bar — uses SharedLayoutBg for smooth sliding active pill. */
export function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Use first 5 items for mobile bottom bar
  const items = navItems.slice(0, 5);

  return (
    <nav
      aria-label="Mobile navigation"
      className="border-border bg-surface fixed inset-x-0 bottom-0 z-40 border-t pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="flex h-16 items-center">
        <SharedLayoutBg
          as="div"
          className="flex w-full flex-row"
          pillClassName="bg-accent-subtle rounded-xl"
          inset={4}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.to
              ? item.to === "/"
                ? pathname === "/"
                : pathname.startsWith(item.to)
              : false;

            const content = (
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1.5 transition-colors duration-150",
                  isActive ? "text-accent" : "text-muted",
                )}
              >
                <div className="relative flex h-7 items-center justify-center">
                  <Icon className="size-[19px]" />
                  {isActive && (
                    <motion.div
                      layoutId="bottom-nav-dot"
                      transition={SPRING_LAYOUT}
                      className="bg-accent absolute -bottom-1.5 size-1 rounded-full"
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] leading-tight font-medium transition-all duration-150",
                    isActive ? "font-semibold" : "",
                  )}
                >
                  {item.label}
                </span>
              </div>
            );

            if (item.to) {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex flex-1 items-center justify-center px-1"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={item.id}
                className="flex flex-1 cursor-not-allowed items-center justify-center px-1 opacity-40"
                aria-disabled="true"
              >
                {content}
              </div>
            );
          })}
        </SharedLayoutBg>
      </div>
    </nav>
  );
}
