import {
  Switch as HeroUISwitch,
  SwitchContent,
  SwitchControl,
  SwitchGroup,
  SwitchGroupRoot,
  SwitchIcon,
  SwitchRoot,
  SwitchThumb,
  type SwitchContentProps,
  type SwitchControlProps,
  type SwitchGroupProps,
  type SwitchGroupRootProps,
  type SwitchIconProps,
  type SwitchProps as HeroUISwitchProps,
  type SwitchRootProps,
  type SwitchThumbProps,
} from "@heroui/react";
import { switchGroupVariants, switchVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customSwitchVariants = tv({
  extend: switchVariants,
  slots: {
    control: "border-border data-selected:bg-accent data-selected:border-accent transition-colors",
    thumb: "bg-white shadow-xs transition-transform",
  },
});

export type CustomSwitchVariants = VariantProps<typeof customSwitchVariants>;

export interface SwitchProps extends HeroUISwitchProps {
  className?: string;
}

function BaseSwitch({ className, ...props }: SwitchProps) {
  const slots = customSwitchVariants();
  return <HeroUISwitch className={cn(slots.base?.(), className)} {...props} />;
}

export const Switch = Object.assign(BaseSwitch, {
  Group: SwitchGroup,
  Root: SwitchRoot,
  Control: SwitchControl,
  Thumb: SwitchThumb,
  Content: SwitchContent,
  Icon: SwitchIcon,
});

export {
  SwitchGroup,
  SwitchRoot,
  SwitchContent,
  SwitchControl,
  SwitchThumb,
  SwitchIcon,
  SwitchGroupRoot,
};

export type SwitchGroupVariants = VariantProps<typeof switchGroupVariants>;
export type {
  SwitchGroupProps,
  SwitchRootProps,
  SwitchContentProps,
  SwitchControlProps,
  SwitchThumbProps,
  SwitchIconProps,
  SwitchGroupRootProps,
  CustomSwitchVariants as SwitchVariants,
};
export { switchVariants, switchGroupVariants } from "@heroui/styles";
