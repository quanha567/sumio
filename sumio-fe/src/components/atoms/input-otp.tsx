import {
  InputOTP as HeroUIInputOTP,
  InputOTPGroup,
  InputOTPRoot,
  InputOTPSeparator,
  InputOTPSlot as HeroUIInputOTPSlot,
} from "@heroui/react";
import { inputOTPVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customInputOTPVariants = tv({
  extend: inputOTPVariants,
});

export type CustomInputOTPVariants = VariantProps<typeof customInputOTPVariants>;

function InputOTPSlotBase({ className, ...props }: ComponentProps<typeof HeroUIInputOTPSlot>) {
  return (
    <HeroUIInputOTPSlot
      className={cn(
        "border border-border bg-field-background text-field-foreground font-mono text-base rounded-md focus:border-focus data-[active=true]:border-focus transition-all",
        className,
      )}
      {...props}
    />
  );
}

export const InputOTP = Object.assign(HeroUIInputOTP, {
  Root: InputOTPRoot,
  Group: InputOTPGroup,
  Slot: InputOTPSlotBase,
  Separator: InputOTPSeparator,
});

export const InputOTPSlot = InputOTPSlotBase;

export { InputOTPRoot, InputOTPGroup, InputOTPSeparator };
export type { InputOTPProps } from "@heroui/react";
export { inputOTPVariants };
export type InputOTPVariants = CustomInputOTPVariants;
