import {
  Kbd as HeroUIKbd,
  KbdAbbr,
  KbdContent,
  KbdRoot,
  type KbdProps as HeroUIKbdProps,
} from "@heroui/react";
import { kbdVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customKbdVariants = tv({
  extend: kbdVariants,
  base: "bg-surface-secondary text-muted border border-border px-1.5 py-0.5 rounded text-[11px] font-mono shadow-2xs inline-flex items-center gap-0.5 select-none",
});

export type CustomKbdVariants = VariantProps<typeof customKbdVariants>;

export interface KbdProps extends HeroUIKbdProps {
  className?: string;
}

function BaseKbd({ className, ...props }: KbdProps) {
  return <HeroUIKbd className={cn(customKbdVariants(), className)} {...props} />;
}

export const Kbd = Object.assign(BaseKbd, {
  Root: KbdRoot,
  Content: KbdContent,
  Abbr: KbdAbbr,
});

export { KbdRoot, KbdContent, KbdAbbr };
export type { KbdRootProps, KbdContentProps, KbdAbbrProps } from "@heroui/react";
export { kbdVariants };
export type KbdVariants = CustomKbdVariants;
