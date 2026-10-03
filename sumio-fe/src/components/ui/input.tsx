import { Input as HeroUIInput, cn } from "@heroui/react";
import type { ComponentProps } from "react";

export interface InputProps extends Omit<ComponentProps<typeof HeroUIInput>, "className"> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <HeroUIInput
      className={cn(
        "rounded-xl border border-border bg-field-background text-sm text-field-foreground placeholder:text-field-placeholder shadow-field focus:border-focus focus:ring-2 focus:ring-focus/20 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
