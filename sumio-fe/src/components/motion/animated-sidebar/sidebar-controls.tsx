import { cn } from "@/lib/utils";

import { useAnimatedSidebar } from "./context";
import type { AnimatedSidebarCloseProps, AnimatedSidebarTriggerProps } from "./types";

export function AnimatedSidebarTrigger({
  ref,
  className,
  onClick,
  type = "button",
  ...props
}: AnimatedSidebarTriggerProps) {
  const context = useAnimatedSidebar();
  const expanded = context.isMobile ? context.openMobile : context.open;

  return (
    <button
      {...props}
      ref={(node) => {
        context.setTriggerNode(node);
        if (typeof ref === "function") ref(node);
        else if (ref && "current" in ref)
          (ref as { current: HTMLButtonElement | null }).current = node;
      }}
      type={type}
      aria-label={props["aria-label"] ?? "Toggle sidebar"}
      aria-expanded={expanded}
      data-slot="sidebar-trigger"
      data-state={expanded ? "expanded" : "collapsed"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) context.toggleSidebar();
      }}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    />
  );
}

export function AnimatedSidebarClose({
  ref,
  className,
  onClick,
  type = "button",
  ...props
}: AnimatedSidebarCloseProps) {
  const context = useAnimatedSidebar();

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      aria-label={props["aria-label"] ?? "Close sidebar"}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (context.isMobile) context.setOpenMobile(false);
        else context.setOpen(false);
      }}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-xl outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    />
  );
}
