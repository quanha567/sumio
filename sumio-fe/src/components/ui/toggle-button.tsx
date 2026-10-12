import { ToggleButton as HeroUIToggleButton, ToggleButtonGroup } from "@heroui/react";

export const ToggleButton = Object.assign(HeroUIToggleButton, {
  Group: ToggleButtonGroup,
});

export {
  ToggleButtonGroup,
  ToggleButtonGroupContext,
  ToggleButtonGroupRoot,
  ToggleButtonGroupSeparator,
  ToggleButtonRoot,
  toggleButtonGroupVariants,
  toggleButtonVariants,
} from "@heroui/react";

export type {
  ToggleButtonProps,
  ToggleButtonGroupProps,
  ToggleButtonGroupRootProps,
  ToggleButtonGroupSeparatorProps,
  ToggleButtonRootProps,
  ToggleButtonVariants,
  ToggleButtonGroupVariants,
} from "@heroui/react";
