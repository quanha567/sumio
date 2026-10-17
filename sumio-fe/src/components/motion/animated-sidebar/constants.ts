import type { Variants } from "motion/react";

import type { VoidFunction } from "@sumio/common";

import { EASE_DRAWER, EASE_OUT } from "@/lib/ease";

import type { SidebarSide } from "./types";

export const MOBILE_QUERY = "(max-width: 767px)";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export const PANEL_TRANSITION = {
  duration: 0.36,
  ease: EASE_DRAWER,
} as const;

export const emptySubscribe = () => () => {};

export const SIDEBAR_MORPH_TRANSITION = {
  type: "spring",
  stiffness: 380,
  damping: 35,
  mass: 0.75,
} as const;

export const LABEL_ENTER_TRANSITION = {
  duration: 0.2,
  delay: 0.08,
  ease: EASE_OUT,
} as const;

export const LABEL_EXIT_TRANSITION = {
  duration: 0.12,
  ease: EASE_OUT,
} as const;

export const SUBMENU_TRANSITION = {
  duration: 0.18,
  ease: EASE_OUT,
} as const;

export const SUBMENU_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    clipPath: "inset(0 0 100% 0 round 8px)",
    transition: {
      duration: 0.14,
      ease: EASE_OUT,
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    clipPath: "inset(0 0 0% 0 round 8px)",
    transition: {
      duration: 0.2,
      delayChildren: 0.035,
      ease: EASE_OUT,
      staggerChildren: 0.045,
    },
  },
};

export const SUBMENU_ITEM_VARIANTS: Variants = {
  closed: {
    opacity: 0,
    y: -6,
    filter: "blur(3px)",
  },
  open: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: SUBMENU_TRANSITION,
  },
};

export const REDUCED_TRANSITION = {
  duration: 0.16,
  ease: EASE_OUT,
} as const;

export const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function subscribeToMobileQuery(callback: VoidFunction): VoidFunction {
  const query = window.matchMedia(MOBILE_QUERY);

  query.addEventListener("change", callback);

  return () => query.removeEventListener("change", callback);
}

export function getMobileSnapshot(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function getServerMobileSnapshot(): boolean {
  return false;
}

export function getMobileSidebarOpacity(reduce: boolean, openMobile: boolean): number {
  if (reduce) return openMobile ? 1 : 0;

  return 1;
}

export function getMobileSidebarX(
  reduce: boolean,
  openMobile: boolean,
  side: SidebarSide,
): string | number {
  if (reduce) return 0;
  if (openMobile) return "0%";

  return side === "left" ? "-100%" : "100%";
}

export function getSidebarWidth(offcanvas: boolean, collapsed: boolean): string {
  if (offcanvas) return "0px";
  if (collapsed) return "var(--sidebar-width-icon)";

  return "var(--sidebar-width)";
}

export function getOffcanvasX(offcanvas: boolean, side: SidebarSide): string {
  if (!offcanvas) return "0%";

  return side === "left" ? "-100%" : "100%";
}

export function getLabelTransition(reduce: boolean, collapsed: boolean) {
  if (reduce) return REDUCED_TRANSITION;
  if (collapsed) return LABEL_EXIT_TRANSITION;

  return LABEL_ENTER_TRANSITION;
}
