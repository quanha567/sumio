import { Checkbox as HeroUICheckbox, cn } from "@heroui/react";
import type { ComponentProps } from "react";

export interface CheckboxProps extends Omit<
  ComponentProps<typeof HeroUICheckbox>,
  "className" | "onChange"
> {
  className?: string;
  onValueChange?: (isSelected: boolean) => void;
  onChange?: (isSelected: boolean) => void;
}

export function Checkbox({
  className,
  children,
  onValueChange,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <HeroUICheckbox
      className={cn(
        "cursor-pointer text-sm text-foreground transition-all duration-200 select-none",
        className,
      )}
      onChange={(isSelected: boolean) => {
        onValueChange?.(isSelected);
        onChange?.(isSelected);
      }}
      {...props}
    >
      {children}
    </HeroUICheckbox>
  );
}
