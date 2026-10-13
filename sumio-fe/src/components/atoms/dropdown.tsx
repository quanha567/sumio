import {
  Dropdown as HeroUIDropdown,
  DropdownItem as HeroUIDropdownItem,
  DropdownItemIndicator,
  DropdownMenu as HeroUIDropdownMenu,
  DropdownPopover as HeroUIDropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
  DropdownTrigger,
} from "@heroui/react";
import { dropdownVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customDropdownVariants = tv({
  extend: dropdownVariants,
});

export type CustomDropdownVariants = VariantProps<typeof customDropdownVariants>;

function DropdownPopoverBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIDropdownPopover>) {
  return (
    <HeroUIDropdownPopover
      className={cn(
        "bg-overlay text-overlay-foreground border border-border rounded-lg shadow-md overflow-hidden outline-none",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuBase({ className, ...props }: ComponentProps<typeof HeroUIDropdownMenu>) {
  return <HeroUIDropdownMenu className={cn("p-1 outline-none", className)} {...props} />;
}

function DropdownItemBase({ className, ...props }: ComponentProps<typeof HeroUIDropdownItem>) {
  return (
    <HeroUIDropdownItem
      className={cn(
        "rounded-sm px-2.5 py-1.5 text-sm text-foreground hover:bg-surface-secondary data-[focused=true]:bg-surface-secondary cursor-pointer outline-none transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export const Dropdown = Object.assign(HeroUIDropdown, {
  Root: DropdownRoot,
  Trigger: DropdownTrigger,
  Popover: DropdownPopoverBase,
  Menu: DropdownMenuBase,
  Item: DropdownItemBase,
  Section: DropdownSection,
  ItemIndicator: DropdownItemIndicator,
  SubmenuIndicator: DropdownSubmenuIndicator,
  SubmenuTrigger: DropdownSubmenuTrigger,
});

export const DropdownPopover = DropdownPopoverBase;
export const DropdownMenu = DropdownMenuBase;
export const DropdownItem = DropdownItemBase;

export {
  DropdownRoot,
  DropdownTrigger,
  DropdownSection,
  DropdownItemIndicator,
  DropdownSubmenuIndicator,
  DropdownSubmenuTrigger,
};

export type { DropdownProps } from "@heroui/react";
export { dropdownVariants };
export type DropdownVariants = CustomDropdownVariants;
