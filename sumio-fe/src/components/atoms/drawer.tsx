import {
  Drawer as HeroUIDrawer,
  DrawerBackdrop as HeroUIDrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDialog as HeroUIDrawerDialog,
  DrawerFooter,
  DrawerHandle as HeroUIDrawerHandle,
  DrawerHeader,
  DrawerHeading,
  DrawerRoot,
  DrawerTrigger,
} from "@heroui/react";
import { drawerVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customDrawerVariants = tv({
  extend: drawerVariants,
});

export type CustomDrawerVariants = VariantProps<typeof customDrawerVariants>;

function DrawerBackdropBase({ className, ...props }: ComponentProps<typeof HeroUIDrawerBackdrop>) {
  return (
    <HeroUIDrawerBackdrop className={cn("bg-backdrop backdrop-blur-xs", className)} {...props} />
  );
}

function DrawerDialogBase({ className, ...props }: ComponentProps<typeof HeroUIDrawerDialog>) {
  return (
    <HeroUIDrawerDialog
      className={cn("bg-surface border-border text-foreground shadow-2xl outline-none", className)}
      {...props}
    />
  );
}

function DrawerHandleBase({ className, ...props }: ComponentProps<typeof HeroUIDrawerHandle>) {
  return (
    <HeroUIDrawerHandle
      className={cn("bg-border-strong/40 hover:bg-border-strong/60", className)}
      {...props}
    />
  );
}

export const Drawer = Object.assign(HeroUIDrawer, {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Backdrop: DrawerBackdropBase,
  Content: DrawerContent,
  Dialog: DrawerDialogBase,
  Header: DrawerHeader,
  Heading: DrawerHeading,
  Body: DrawerBody,
  Footer: DrawerFooter,
  Handle: DrawerHandleBase,
  CloseTrigger: DrawerCloseTrigger,
});

export const DrawerBackdrop = DrawerBackdropBase;
export const DrawerDialog = DrawerDialogBase;
export const DrawerHandle = DrawerHandleBase;

export {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerHeading,
  DrawerBody,
  DrawerFooter,
  DrawerCloseTrigger,
};

export type { DrawerProps } from "@heroui/react";
export { drawerVariants };
export type DrawerVariants = CustomDrawerVariants;
