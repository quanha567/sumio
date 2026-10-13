import {
  Alert as HeroUIAlert,
  AlertContent,
  AlertDescription,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseTrigger,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogIcon,
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertIndicator,
  AlertRoot as HeroUIAlertRoot,
  AlertTitle,
  type AlertProps as HeroUIAlertProps,
} from "@heroui/react";
import { alertVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customAlertVariants = tv({
  extend: alertVariants,
  base: "rounded-card border p-3.5 flex items-start gap-3 transition-all",
  variants: {
    intent: {
      default: "bg-surface-secondary border-border text-foreground",
      accent: "bg-accent-subtle border-accent/20 text-accent-subtle-foreground",
      success: "bg-success-subtle border-success/20 text-foreground",
      warning: "bg-warning-subtle border-warning/20 text-foreground",
      danger: "bg-danger-subtle border-danger/20 text-foreground",
      info: "bg-info-subtle border-info/20 text-foreground",
    },
  },
  defaultVariants: {
    intent: "default",
  },
});

export type CustomAlertVariants = VariantProps<typeof customAlertVariants>;

export interface AlertProps extends Omit<HeroUIAlertProps, "className">, CustomAlertVariants {
  className?: string;
}

function AlertBase({ intent, className, ...props }: AlertProps) {
  const slots = customAlertVariants({ intent });
  const baseClass = typeof slots === "object" && "base" in slots ? slots.base() : "";

  return <HeroUIAlert className={cn(baseClass, className)} {...props} />;
}

export const Alert = Object.assign(AlertBase, {
  Root: HeroUIAlertRoot,
  Indicator: AlertIndicator,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
});

export const AlertRoot = HeroUIAlertRoot;
export {
  AlertIndicator,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertDialog,
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogBackdrop,
  AlertDialogContainer,
  AlertDialogDialog,
  AlertDialogHeader,
  AlertDialogHeading,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogIcon,
  AlertDialogCloseTrigger,
};
export type { AlertDialogProps } from "@heroui/react";
export type { CustomAlertVariants as AlertVariants };
export { alertVariants, alertDialogVariants } from "@heroui/styles";
