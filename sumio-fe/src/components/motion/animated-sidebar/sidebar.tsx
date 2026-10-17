import { motion } from "motion/react";
import { useMemo } from "react";

import { cn } from "@/lib/utils";

import {
  PANEL_TRANSITION,
  REDUCED_TRANSITION,
  SIDEBAR_MORPH_TRANSITION,
  getOffcanvasX,
  getSidebarWidth,
} from "./constants";
import { AnimatedSidebarPanelContext, useAnimatedSidebar } from "./context";
import { MobileSidebar } from "./mobile-sidebar";
import type { AnimatedSidebarProps } from "./types";

export function AnimatedSidebar({
  ref,
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  ariaLabel = "Sidebar",
  children,
  className,
  panelClassName,
  style,
  ...props
}: AnimatedSidebarProps) {
  const context = useAnimatedSidebar();
  const collapsed = collapsible !== "none" && !context.open;
  const offcanvas = collapsed && collapsible === "offcanvas";
  const width = getSidebarWidth(offcanvas, collapsed);

  const panelValue = useMemo(
    () => ({ collapsed, collapsible, side }),
    [collapsed, collapsible, side],
  );

  if (context.isMobile) {
    return (
      <MobileSidebar ariaLabel={ariaLabel} className={className} side={side}>
        {children}
      </MobileSidebar>
    );
  }

  return (
    <motion.aside
      {...props}
      ref={ref}
      initial={false}
      aria-label={ariaLabel}
      data-slot="sidebar"
      data-state={collapsed ? "collapsed" : "expanded"}
      data-collapsible={collapsible}
      data-variant={variant}
      data-side={side}
      animate={{ width }}
      transition={context.reduce ? { duration: 0 } : SIDEBAR_MORPH_TRANSITION}
      style={style}
      className={cn(
        "group/sidebar relative hidden h-auto shrink-0 md:block will-change-[width]",
        "peer",
        side === "right" && "order-last",
        className,
      )}
    >
      <motion.div
        initial={false}
        animate={{
          opacity: offcanvas ? 0 : 1,
          x: getOffcanvasX(offcanvas, side),
        }}
        transition={context.reduce ? REDUCED_TRANSITION : PANEL_TRANSITION}
        className={cn(
          "sticky top-0 flex h-svh w-full flex-col overflow-hidden bg-surface",
          collapsible === "offcanvas" && "w-[var(--sidebar-width)]",
          variant === "sidebar" &&
            (side === "left" ? "border-border border-r" : "border-border border-l"),
          variant === "floating" &&
            "m-2 h-[calc(100svh-1rem)] rounded-2xl border border-border shadow-sm",
          variant === "inset" && "m-2 h-[calc(100svh-1rem)] rounded-2xl",
          panelClassName,
        )}
      >
        <AnimatedSidebarPanelContext value={panelValue}>{children}</AnimatedSidebarPanelContext>
      </motion.div>
    </motion.aside>
  );
}
