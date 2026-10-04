import { cn } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

import { type Tone, toneStyles } from "./tone";

interface IconBadgeProps {
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
  iconClassName?: string;
}

/** Rounded tinted square holding an icon. */
export function IconBadge({
  icon: Icon,
  tone = "accent",
  className,
  iconClassName,
}: IconBadgeProps) {
  const style = toneStyles[tone];
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        style.soft,
        style.text,
        className,
      )}
    >
      <Icon className={cn("h-5 w-5", iconClassName)} />
    </div>
  );
}
