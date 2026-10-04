import { Button as HeroUIButton, cn } from "@heroui/react";
import type { ComponentProps } from "react";

export interface ButtonProps extends Omit<ComponentProps<typeof HeroUIButton>, "className"> {
  className?: string;
  disabled?: boolean;
  title?: string;
}

export function Button({ className, children, disabled, isDisabled, ...props }: ButtonProps) {
  return (
    <HeroUIButton
      isDisabled={disabled ?? isDisabled}
      className={cn(
        "cursor-pointer rounded-lg font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
        className,
      )}
      {...props}
    >
      {children}
    </HeroUIButton>
  );
}
