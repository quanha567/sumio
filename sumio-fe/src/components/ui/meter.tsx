import { Meter as HeroUIMeter, MeterFill, MeterOutput, MeterRoot, MeterTrack } from "@heroui/react";
import { meterVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customMeterVariants = tv({
  extend: meterVariants,
  slots: {
    track: "bg-surface-secondary rounded-full overflow-hidden",
    fill: "bg-accent transition-all duration-300",
  },
});

export type CustomMeterVariants = VariantProps<typeof customMeterVariants>;

function BaseMeter({ className, ...props }: ComponentProps<typeof HeroUIMeter>) {
  return <HeroUIMeter className={cn("w-full", className)} {...props} />;
}

export const Meter = Object.assign(BaseMeter, {
  Root: MeterRoot,
  Track: MeterTrack,
  Fill: MeterFill,
  Output: MeterOutput,
});

export { MeterRoot, MeterTrack, MeterFill, MeterOutput };
export type { MeterProps } from "@heroui/react";
export { meterVariants };
export type MeterVariants = CustomMeterVariants;
