import type { HTMLMotionProps } from "motion/react";
import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefObject,
} from "react";

import type { OnChange, VoidFunction } from "@sumio/common";

export type SidebarState = "expanded" | "collapsed";
export type SidebarSide = "left" | "right";
export type SidebarVariant = "sidebar" | "floating" | "inset";
export type SidebarCollapsible = "offcanvas" | "icon" | "none";

export interface AnimatedSidebarContextValue {
  isMobile: boolean;
  layoutId: string;
  open: boolean;
  openMobile: boolean;
  reduce: boolean;
  setOpen: OnChange<boolean>;
  setOpenMobile: OnChange<boolean>;
  state: SidebarState;
  toggleSidebar: VoidFunction;
  triggerRef: RefObject<HTMLButtonElement | null>;
  setTriggerNode: (node: HTMLButtonElement | null) => void;
}

export interface AnimatedSidebarPanelContextValue {
  collapsed: boolean;
  collapsible: SidebarCollapsible;
  side: SidebarSide;
}

export type SidebarProviderStyle = CSSProperties & {
  "--sidebar-width"?: string;
  "--sidebar-width-icon"?: string;
  "--sidebar-width-mobile"?: string;
};

export interface AnimatedSidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean;
  defaultOpenMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  style?: SidebarProviderStyle;
}

export interface AnimatedSidebarProps extends Omit<HTMLMotionProps<"aside">, "children"> {
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
  side?: SidebarSide;
  variant?: SidebarVariant;
  collapsible?: SidebarCollapsible;
  ariaLabel?: string;
  panelClassName?: string;
}

export interface AnimatedSidebarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
}

export interface AnimatedSidebarCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
}

export interface AnimatedSidebarRailProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
}

export interface AnimatedSidebarInsetProps extends HTMLMotionProps<"main"> {
  ref?: Ref<HTMLElement>;
}

export interface AnimatedSidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export interface AnimatedSidebarContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export interface AnimatedSidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export interface AnimatedSidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export interface AnimatedSidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export interface AnimatedSidebarGroupContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export interface AnimatedSidebarMenuProps extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
}

export interface AnimatedSidebarMenuItemProps extends HTMLMotionProps<"li"> {
  ref?: Ref<HTMLLIElement>;
}

export interface AnimatedSidebarMenuSubProps extends Omit<HTMLMotionProps<"ul">, "children"> {
  ref?: Ref<HTMLUListElement>;
  open: boolean;
  children?: ReactNode;
}

export interface AnimatedSidebarMenuSubItemProps extends HTMLMotionProps<"li"> {
  ref?: Ref<HTMLLIElement>;
}

export interface AnimatedSidebarMenuSubButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  isActive?: boolean;
  disabled?: boolean;
  closeOnSelect?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onSelect?: VoidFunction;
  className?: string;
}

export interface AnimatedSidebarMenuButtonProps {
  children: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  isActive?: boolean;
  ariaExpanded?: boolean;
  disabled?: boolean;
  closeOnSelect?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onSelect?: VoidFunction;
  className?: string;
}
