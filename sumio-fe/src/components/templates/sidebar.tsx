import { formatMajorCurrencyAmount } from "@sumio/common";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { Button, Card, ProgressRing, Text } from "@/components/atoms";
import {
  AnimatedSidebar,
  AnimatedSidebarContent,
  AnimatedSidebarFooter,
  AnimatedSidebarGroup,
  AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader,
  AnimatedSidebarMenu,
  AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem,
  AnimatedSidebarRail,
  useAnimatedSidebar,
} from "@/components/motion/animated-sidebar";
import { cn } from "@/lib/utils";

import { BrandLogo } from "./brand-logo";
import { navItems } from "./nav-items";

interface NavSidebarProps {
  savingsSaved?: number;
  savingsTarget?: number;
  onLogout?: () => void | Promise<void>;
}

function checkNavActive(to: string | undefined, pathname: string): boolean {
  if (!to) return false;
  if (to === "/") return pathname === "/";
  return pathname.startsWith(to);
}

export function NavSidebar({ savingsSaved, savingsTarget, onLogout }: NavSidebarProps) {
  const hasSavingsGoal =
    savingsSaved !== undefined && savingsTarget !== undefined && savingsTarget > 0;
  const percent = hasSavingsGoal ? Math.round((savingsSaved / savingsTarget) * 100) : 0;
  const { state } = useAnimatedSidebar();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout?.();
    } catch {
      // ignore
    }
  };

  return (
    <AnimatedSidebar collapsible="icon" variant="sidebar">
      <AnimatedSidebarHeader className="border-border h-14 flex-row items-center border-b px-3 py-0">
        {collapsed ? (
          <div className="flex w-full justify-center">
            <BrandLogo iconOnly />
          </div>
        ) : (
          <BrandLogo />
        )}
      </AnimatedSidebarHeader>

      <AnimatedSidebarContent>
        <AnimatedSidebarGroup>
          <AnimatedSidebarGroupLabel>Menu</AnimatedSidebarGroupLabel>

          <AnimatedSidebarMenu>
            {navItems.map(({ id, label, icon: Icon, to }) => {
              const isActive = checkNavActive(to, pathname);

              if (to) {
                return (
                  <AnimatedSidebarMenuItem key={id}>
                    <AnimatedSidebarMenuButton
                      icon={<Icon className="size-[18px]" />}
                      isActive={isActive}
                      onSelect={() => void navigate({ to })}
                      className={cn(isActive ? "text-accent" : "text-muted hover:text-foreground")}
                    >
                      {label}
                    </AnimatedSidebarMenuButton>
                  </AnimatedSidebarMenuItem>
                );
              }

              return (
                <AnimatedSidebarMenuItem key={id}>
                  <AnimatedSidebarMenuButton
                    icon={<Icon className="size-[18px]" />}
                    disabled
                    className="text-muted"
                  >
                    {label}
                  </AnimatedSidebarMenuButton>
                </AnimatedSidebarMenuItem>
              );
            })}
          </AnimatedSidebarMenu>
        </AnimatedSidebarGroup>
      </AnimatedSidebarContent>

      <AnimatedSidebarFooter className={cn("gap-2.5", collapsed ? "px-2" : "px-3")}>
        {!collapsed && hasSavingsGoal && (
          <Card intent="secondary" className="flex items-center gap-3 p-3">
            <ProgressRing value={percent} ariaLabel="Monthly saving goal" color="sand">
              {percent}%
            </ProgressRing>
            <div className="min-w-0">
              <Text variant="label">Monthly saving goal</Text>
              <Text variant="caption">
                {formatMajorCurrencyAmount(savingsSaved ?? 0)} /{" "}
                {formatMajorCurrencyAmount(savingsTarget ?? 0)}
              </Text>
            </div>
          </Card>
        )}

        <Button
          intent="ghost"
          onPress={() => void handleLogout()}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-danger-subtle hover:text-danger h-auto cursor-pointer",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut className="size-[18px] shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </AnimatedSidebarFooter>

      <AnimatedSidebarRail />
    </AnimatedSidebar>
  );
}
