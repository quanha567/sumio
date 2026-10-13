import { useReducedMotion } from "motion/react";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { cn } from "@/lib/utils";

import {
  SIDEBAR_KEYBOARD_SHORTCUT,
  getMobileSnapshot,
  getServerMobileSnapshot,
  subscribeToMobileQuery,
} from "./constants";
import type {
  AnimatedSidebarContextValue,
  AnimatedSidebarPanelContextValue,
  AnimatedSidebarProviderProps,
  SidebarState,
} from "./types";

export const AnimatedSidebarContext = createContext<AnimatedSidebarContextValue | null>(null);
export const AnimatedSidebarPanelContext = createContext<AnimatedSidebarPanelContextValue | null>(
  null,
);

export function useAnimatedSidebar() {
  const context = use(AnimatedSidebarContext);
  if (!context) {
    throw new Error("useAnimatedSidebar must be used inside AnimatedSidebarProvider.");
  }
  return context;
}

export function useAnimatedSidebarPanel() {
  const context = use(AnimatedSidebarPanelContext);
  if (!context) {
    throw new Error("Animated Sidebar parts must be used inside AnimatedSidebar.");
  }
  return context;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribeToMobileQuery, getMobileSnapshot, getServerMobileSnapshot);
}

function useAnimatedSidebarShortcut(toggleSidebar: () => void) {
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [toggleSidebar]);
}

export function AnimatedSidebarProvider({
  children,
  open,
  defaultOpen = true,
  onOpenChange,
  openMobile,
  defaultOpenMobile = false,
  onOpenMobileChange,
  className,
  style,
  ...props
}: AnimatedSidebarProviderProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [internalOpenMobile, setInternalOpenMobile] = useState(defaultOpenMobile);
  const isMobile = useIsMobile();
  const reduce = useReducedMotion() ?? false;
  const generatedId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopOpen = open ?? internalOpen;
  const mobileOpen = openMobile ?? internalOpenMobile;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (open === undefined) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, open],
  );

  const setOpenMobile = useCallback(
    (nextOpen: boolean) => {
      if (openMobile === undefined) setInternalOpenMobile(nextOpen);
      onOpenMobileChange?.(nextOpen);
    },
    [onOpenMobileChange, openMobile],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile(!mobileOpen);
    else setOpen(!desktopOpen);
  }, [desktopOpen, isMobile, mobileOpen, setOpen, setOpenMobile]);

  const setTriggerNode = useCallback((node: HTMLButtonElement | null) => {
    (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  }, []);

  useAnimatedSidebarShortcut(toggleSidebar);

  const contextValue = useMemo(
    () => ({
      isMobile,
      layoutId: `${generatedId}-active`,
      open: desktopOpen,
      openMobile: mobileOpen,
      reduce,
      setOpen,
      setOpenMobile,
      state: (desktopOpen ? "expanded" : "collapsed") as SidebarState,
      toggleSidebar,
      triggerRef,
      setTriggerNode,
    }),
    [
      isMobile,
      generatedId,
      desktopOpen,
      mobileOpen,
      reduce,
      setOpen,
      setOpenMobile,
      toggleSidebar,
      triggerRef,
      setTriggerNode,
    ],
  );

  return (
    <AnimatedSidebarContext value={contextValue}>
      <div
        {...props}
        data-slot="sidebar-wrapper"
        data-state={desktopOpen ? "expanded" : "collapsed"}
        style={{
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "4.25rem",
          "--sidebar-width-mobile": "18rem",
          ...style,
        }}
        className={cn("group/sidebar-wrapper flex min-h-svh w-full min-w-0", className)}
      >
        {children}
      </div>
    </AnimatedSidebarContext>
  );
}
