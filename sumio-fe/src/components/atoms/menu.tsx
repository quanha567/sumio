import {
  Menu as HeroUIMenu,
  MenuItem as HeroUIMenuItem,
  MenuItemIndicator,
  MenuItemSubmenuIndicator,
  MenuRoot,
  MenuSection,
} from "@heroui/react";
import {
  menuItemVariants,
  menuSectionVariants,
  menuVariants,
  tv,
  type VariantProps,
} from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customMenuVariants = tv({
  extend: menuVariants,
  base: "p-1 outline-none bg-overlay text-overlay-foreground border border-border rounded-lg shadow-md",
});

export const customMenuItemVariants = tv({
  extend: menuItemVariants,
  base: "rounded-sm px-2.5 py-1.5 text-sm text-foreground hover:bg-surface-secondary data-[focused=true]:bg-surface-secondary cursor-pointer outline-none transition-colors",
});

export type CustomMenuVariants = VariantProps<typeof customMenuVariants>;
export type CustomMenuItemVariants = VariantProps<typeof customMenuItemVariants>;

function MenuBase({ className, ...props }: ComponentProps<typeof HeroUIMenu>) {
  return <HeroUIMenu className={cn(customMenuVariants(), className)} {...props} />;
}

function MenuItemBase({ className, ...props }: ComponentProps<typeof HeroUIMenuItem>) {
  return <HeroUIMenuItem className={cn(customMenuItemVariants(), className)} {...props} />;
}

export const Menu = Object.assign(MenuBase, {
  Root: MenuRoot,
  Item: MenuItemBase,
  ItemIndicator: MenuItemIndicator,
  ItemSubmenuIndicator: MenuItemSubmenuIndicator,
  Section: MenuSection,
});

export const MenuItem = MenuItemBase;

export { MenuRoot, MenuItemIndicator, MenuItemSubmenuIndicator, MenuSection };

export type { MenuProps } from "@heroui/react";
export { menuVariants, menuItemVariants, menuSectionVariants };
export type MenuVariants = CustomMenuVariants;
export type MenuItemVariants = CustomMenuItemVariants;
