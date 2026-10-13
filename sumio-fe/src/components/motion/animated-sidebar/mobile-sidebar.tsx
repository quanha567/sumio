import { motion } from "motion/react";
import type { ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

import {
  FOCUSABLE_SELECTOR,
  PANEL_TRANSITION,
  REDUCED_TRANSITION,
  emptySubscribe,
  getMobileSidebarOpacity,
  getMobileSidebarX,
} from "./constants";
import { AnimatedSidebarPanelContext, useAnimatedSidebar } from "./context";
import type { SidebarSide } from "./types";

function useMobileSidebarBodyLock(
  openMobile: boolean,
  triggerRef: RefObject<HTMLButtonElement | null>,
  panelRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    if (!openMobile) return;

    const body = document.body;
    const scrollY = window.scrollY;
    const previousBodyStyles = {
      left: body.style.left,
      overflow: body.style.overflow,
      position: body.style.position,
      right: body.style.right,
      top: body.style.top,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      (firstFocusable ?? panelRef.current)?.focus({ preventScroll: true });
    });

    const triggerNode = triggerRef.current;

    return () => {
      cancelAnimationFrame(focusFrame);
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.overflow = previousBodyStyles.overflow;
      window.scrollTo(0, scrollY);
      triggerNode?.focus({ preventScroll: true });
    };
  }, [openMobile, triggerRef, panelRef]);
}

function handleMobileSidebarKeyDown(
  event: React.KeyboardEvent,
  panelRef: RefObject<HTMLDivElement | null>,
  setOpenMobile: (open: boolean) => void,
) {
  if (event.key === "Escape") {
    event.preventDefault();
    setOpenMobile(false);
    return;
  }

  if (event.key !== "Tab") return;
  const focusable = panelRef.current
    ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    : [];

  if (focusable.length === 0) {
    event.preventDefault();
    panelRef.current?.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable.at(-1);
  if (!last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export interface MobileSidebarProps {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  side: SidebarSide;
}

export function MobileSidebar({ ariaLabel, children, className, side }: MobileSidebarProps) {
  const context = useAnimatedSidebar();
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const [hidden, setHidden] = useState(!context.openMobile);
  const [prevOpenMobile, setPrevOpenMobile] = useState(context.openMobile);
  if (prevOpenMobile !== context.openMobile) {
    setPrevOpenMobile(context.openMobile);
    if (context.openMobile) {
      setHidden(false);
    }
  }

  const openMobileRef = useRef(context.openMobile);
  useEffect(() => {
    openMobileRef.current = context.openMobile;
  }, [context.openMobile]);

  const panelValue = useMemo(
    () => ({ collapsed: false, collapsible: "none" as const, side }),
    [side],
  );

  useMobileSidebarBodyLock(context.openMobile, context.triggerRef, panelRef);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-50 size-0 md:hidden",
        hidden && !context.openMobile ? "invisible" : "visible",
      )}
    >
      <motion.button
        type="button"
        aria-label="Close sidebar"
        tabIndex={context.openMobile ? 0 : -1}
        initial={false}
        animate={{ opacity: context.openMobile ? 1 : 0 }}
        transition={context.reduce ? REDUCED_TRANSITION : PANEL_TRANSITION}
        onClick={() => context.setOpenMobile(false)}
        className={cn(
          "fixed inset-0 bg-black/40",
          context.openMobile ? "pointer-events-auto" : "pointer-events-none",
        )}
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-hidden={!context.openMobile}
        inert={!context.openMobile}
        tabIndex={-1}
        data-mobile="true"
        data-state={context.openMobile ? "expanded" : "collapsed"}
        data-side={side}
        initial={false}
        animate={{
          opacity: getMobileSidebarOpacity(context.reduce, context.openMobile),
          x: getMobileSidebarX(context.reduce, context.openMobile, side),
        }}
        transition={context.reduce ? REDUCED_TRANSITION : PANEL_TRANSITION}
        onAnimationComplete={() => {
          if (!openMobileRef.current) setHidden(true);
        }}
        onKeyDown={(event) => handleMobileSidebarKeyDown(event, panelRef, context.setOpenMobile)}
        className={cn(
          "pointer-events-auto fixed inset-y-0 flex h-dvh w-(--sidebar-width-mobile) max-w-[88vw] flex-col overflow-hidden",
          "border-border bg-surface shadow-2xl will-change-transform",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          !context.openMobile && "pointer-events-none",
          className,
        )}
      >
        <AnimatedSidebarPanelContext value={panelValue}>{children}</AnimatedSidebarPanelContext>
      </motion.div>
    </div>,
    document.body,
  );
}
