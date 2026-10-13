import { motion } from "motion/react";

import { cn } from "@/lib/utils";

import { useAnimatedSidebar, useAnimatedSidebarPanel } from "./context";
import type {
  AnimatedSidebarContentProps,
  AnimatedSidebarFooterProps,
  AnimatedSidebarHeaderProps,
  AnimatedSidebarInsetProps,
  AnimatedSidebarRailProps,
} from "./types";

export function AnimatedSidebarRail({
  ref,
  className,
  onClick,
  type = "button",
  ...props
}: AnimatedSidebarRailProps) {
  const context = useAnimatedSidebar();
  const panel = useAnimatedSidebarPanel();

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      data-side={panel.side}
      aria-label={props["aria-label"] ?? "Toggle sidebar"}
      title="Toggle sidebar"
      tabIndex={-1}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.toggleSidebar();
      }}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 outline-none md:block",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-transparent after:transition-colors hover:after:bg-border",
        "data-[side=right]:right-0 data-[side=right]:translate-x-1/2 data-[side=left]:left-full",
        className,
      )}
    />
  );
}

export function AnimatedSidebarInset({ ref, className, ...props }: AnimatedSidebarInsetProps) {
  return (
    <motion.main
      {...props}
      ref={ref}
      data-slot="sidebar-inset"
      className={cn(
        "relative flex min-h-svh min-w-0 flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-sm",
        className,
      )}
    />
  );
}

export function AnimatedSidebarHeader({ ref, className, ...props }: AnimatedSidebarHeaderProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="sidebar-header"
      className={cn("flex shrink-0 items-center gap-2 p-3", className)}
    />
  );
}

export function AnimatedSidebarContent({ ref, className, ...props }: AnimatedSidebarContentProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2",
        className,
      )}
    />
  );
}

export function AnimatedSidebarFooter({ ref, className, ...props }: AnimatedSidebarFooterProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="sidebar-footer"
      className={cn(
        "flex shrink-0 flex-col gap-2 border-border border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        className,
      )}
    />
  );
}
