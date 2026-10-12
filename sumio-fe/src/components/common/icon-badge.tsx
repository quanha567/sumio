import type { LucideIcon } from "lucide-react";

import { cn, type Tone, toneStyles } from "@/components/ui";

export interface IconBadgeProps {
  icon: LucideIcon;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  shape?: "square" | "circle";
  className?: string;
  iconClassName?: string;
}

const sizeStyles = {
  sm: {
    container: "size-8",
    icon: "size-4",
  },
  md: {
    container: "size-10",
    icon: "size-5",
  },
  lg: {
    container: "size-12",
    icon: "size-6",
  },
} as const;

const shapeStyles = {
  square: "rounded-xl",
  circle: "rounded-full",
} as const;

/** Rounded or circular tinted container holding an icon. */
export function IconBadge({
  icon: Icon,
  tone = "accent",
  size = "md",
  shape = "square",
  className,
  iconClassName,
}: IconBadgeProps) {
  const toneStyle = toneStyles[tone];
  const sizeStyle = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        sizeStyle.container,
        shapeStyles[shape],
        toneStyle.soft,
        toneStyle.text,
        className,
      )}
    >
      <Icon className={cn(sizeStyle.icon, iconClassName)} />
    </div>
  );
}
