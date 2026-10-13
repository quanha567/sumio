import { cn } from "@/lib/utils";

import { useAnimatedSidebarPanel } from "./context";
import type {
  AnimatedSidebarGroupContentProps,
  AnimatedSidebarGroupLabelProps,
  AnimatedSidebarGroupProps,
} from "./types";

export function AnimatedSidebarGroup({ ref, className, ...props }: AnimatedSidebarGroupProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="sidebar-group"
      className={cn("flex w-full min-w-0 flex-col px-1 py-1.5", className)}
    />
  );
}

export function AnimatedSidebarGroupLabel({
  ref,
  children,
  className,
  ...props
}: AnimatedSidebarGroupLabelProps) {
  const { collapsed } = useAnimatedSidebarPanel();

  return (
    <div
      {...props}
      ref={ref}
      aria-hidden={collapsed}
      data-slot="sidebar-group-label"
      className={cn(
        "mb-1 h-7 overflow-hidden px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted transition-opacity",
        collapsed ? "opacity-0" : "opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AnimatedSidebarGroupContent({
  ref,
  className,
  ...props
}: AnimatedSidebarGroupContentProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="sidebar-group-content"
      className={cn("w-full min-w-0", className)}
    />
  );
}
