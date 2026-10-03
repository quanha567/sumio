import { Badge as HeroUIBadge } from "@heroui/react";
import type { ComponentProps } from "react";

export type BadgeProps = ComponentProps<typeof HeroUIBadge>;

export function Badge({ className = "", children, ...props }: BadgeProps) {
  return (
    <HeroUIBadge
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}
      {...props}
    >
      {children}
    </HeroUIBadge>
  );
}
