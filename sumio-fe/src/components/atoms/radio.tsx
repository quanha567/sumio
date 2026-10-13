import {
  Radio as HeroUIRadio,
  RadioControl,
  RadioGroup,
  RadioGroupRoot,
  RadioIndicator,
  RadioRoot,
  type RadioGroupProps,
  type RadioProps as HeroUIRadioProps,
} from "@heroui/react";
import { radioGroupVariants, radioVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customRadioVariants = tv({
  extend: radioVariants,
  slots: {
    control:
      "border-border data-selected:border-accent data-selected:bg-accent text-accent-foreground transition-all",
  },
});

export type CustomRadioVariants = VariantProps<typeof customRadioVariants>;

export interface RadioProps extends HeroUIRadioProps {
  className?: string;
}

function BaseRadio({ className, ...props }: RadioProps) {
  const slots = customRadioVariants();
  return <HeroUIRadio className={cn(slots.base?.(), className)} {...props} />;
}

export const Radio = Object.assign(BaseRadio, {
  Root: RadioRoot,
  Control: RadioControl,
  Indicator: RadioIndicator,
  Group: RadioGroup,
});

export { RadioRoot, RadioControl, RadioIndicator, RadioGroup, RadioGroupRoot };

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
export type { RadioGroupProps, CustomRadioVariants as RadioVariants };
export { radioVariants, radioGroupVariants } from "@heroui/styles";
