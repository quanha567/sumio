import { Link, useRouterState } from "@tanstack/react-router";

import { ColorDot, Text } from "@/components/atoms";
import { motion, SharedLayoutBg } from "@/components/motion";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

import { navItems } from "./nav-items";

// Use first 5 items for mobile bottom bar
const items = navItems.slice(0, 5);

function checkBottomNavActive(to: string | undefined, pathname: string): boolean {
  if (!to) return false;
  if (to === "/") return pathname === "/";

  return pathname.startsWith(to);
}

export function BottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

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
            const isActive = checkBottomNavActive(item.to, pathname);

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
                      className="absolute -bottom-1.5"
                    >
                      <ColorDot tone="accent" size="xs" />
                    </motion.div>
                  )}
                </div>

                <Text
                  variant="caption"
                  weight={isActive ? "semibold" : "medium"}
                  className="leading-tight transition-all duration-150"
                >
                  {item.label}
                </Text>
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
