import { Button as HeroUIButton, cn } from "@heroui/react";
import type { ComponentProps } from "react";

export interface ButtonProps extends Omit<ComponentProps<typeof HeroUIButton>, "className"> {
  className?: string;
}

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <HeroUIButton
      className={cn(
        "cursor-pointer font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </HeroUIButton>
  );
}
