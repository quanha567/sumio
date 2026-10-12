import {
  Slider as HeroUISlider,
  SliderFill,
  SliderMarks,
  SliderOutput,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from "@heroui/react";
import { sliderVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customSliderVariants = tv({
  extend: sliderVariants,
  slots: {
    track: "bg-surface-secondary rounded-full",
    fill: "bg-accent rounded-full",
    thumb:
      "bg-surface border-2 border-accent shadow-sm hover:scale-105 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-focus",
  },
});

export type CustomSliderVariants = VariantProps<typeof customSliderVariants>;

function BaseSlider({ className, ...props }: ComponentProps<typeof HeroUISlider>) {
  return <HeroUISlider className={cn("w-full", className)} {...props} />;
}

export const Slider = Object.assign(BaseSlider, {
  Root: SliderRoot,
  Track: SliderTrack,
  Fill: SliderFill,
  Thumb: SliderThumb,
  Marks: SliderMarks,
  Output: SliderOutput,
});

export { SliderRoot, SliderTrack, SliderFill, SliderThumb, SliderMarks, SliderOutput };
export type { SliderProps } from "@heroui/react";
export { sliderVariants };
export type SliderVariants = CustomSliderVariants;
