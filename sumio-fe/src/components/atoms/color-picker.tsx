import {
  ColorArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorField,
  ColorFieldRoot,
  ColorPicker as HeroUIColorPicker,
  ColorPickerPopover as HeroUIColorPickerPopover,
  ColorPickerRoot,
  ColorPickerTrigger,
  ColorSlider,
  ColorSliderOutput,
  ColorSliderRoot,
  ColorSliderThumb,
  ColorSliderTrack,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerIndicator,
  ColorSwatchPickerItem,
  ColorSwatchPickerRoot,
  ColorSwatchPickerSwatch,
  ColorSwatchRoot,
} from "@heroui/react";
import {
  colorAreaVariants,
  colorFieldVariants,
  colorPickerVariants,
  colorSliderVariants,
  colorSwatchPickerVariants,
  colorSwatchVariants,
} from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

function ColorPickerPopoverBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIColorPickerPopover>) {
  return (
    <HeroUIColorPickerPopover
      className={cn(
        "bg-overlay text-overlay-foreground border border-border rounded-xl shadow-lg p-3 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export const ColorPicker = Object.assign(HeroUIColorPicker, {
  Root: ColorPickerRoot,
  Trigger: ColorPickerTrigger,
  Popover: ColorPickerPopoverBase,
});

export const ColorPickerPopover = ColorPickerPopoverBase;

export {
  ColorPickerRoot,
  ColorPickerTrigger,
  ColorArea,
  ColorAreaRoot,
  ColorAreaThumb,
  ColorField,
  ColorFieldRoot,
  ColorSlider,
  ColorSliderRoot,
  ColorSliderTrack,
  ColorSliderThumb,
  ColorSliderOutput,
  ColorSwatch,
  ColorSwatchRoot,
  ColorSwatchPicker,
  ColorSwatchPickerRoot,
  ColorSwatchPickerItem,
  ColorSwatchPickerIndicator,
  ColorSwatchPickerSwatch,
};

export type {
  ColorPickerProps,
  ColorAreaProps,
  ColorFieldProps,
  ColorSliderProps,
  ColorSwatchProps,
  ColorSwatchPickerProps,
} from "@heroui/react";
export {
  colorPickerVariants,
  colorAreaVariants,
  colorFieldVariants,
  colorSliderVariants,
  colorSwatchVariants,
  colorSwatchPickerVariants,
};
