import {
  Toast as HeroUIToast,
  ToastActionButton,
  ToastCloseButton,
  ToastContent,
  ToastDescription,
  ToastIndicator,
  ToastProvider,
  ToastQueue,
  ToastTitle,
  toast,
  toastQueue,
} from "@heroui/react";
import { toastVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customToastVariants = tv({
  extend: toastVariants,
  base: "bg-surface border border-border text-foreground shadow-lg rounded-xl p-3",
});

export type CustomToastVariants = VariantProps<typeof customToastVariants>;

function BaseToast({ className, ...props }: ComponentProps<typeof HeroUIToast>) {
  return <HeroUIToast className={cn(customToastVariants(), className)} {...props} />;
}

export const Toast = Object.assign(BaseToast, {
  Title: ToastTitle,
  Description: ToastDescription,
  Content: ToastContent,
  Indicator: ToastIndicator,
  CloseButton: ToastCloseButton,
  ActionButton: ToastActionButton,
  Provider: ToastProvider,
  Queue: ToastQueue,
});

export {
  ToastTitle,
  ToastDescription,
  ToastContent,
  ToastIndicator,
  ToastCloseButton,
  ToastActionButton,
  ToastProvider,
  ToastQueue,
  toast,
  toastQueue,
};

export type {
  ToastProps,
  ToastCloseButtonProps,
  ToastContentProps,
  ToastDescriptionProps,
  ToastIndicatorProps,
  ToastProviderProps,
  ToastTitleProps,
} from "@heroui/react";
export { toastVariants };
export type ToastVariants = CustomToastVariants;
