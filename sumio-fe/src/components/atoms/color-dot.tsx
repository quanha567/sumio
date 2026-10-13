import { cn } from "@/lib/utils";

export interface ColorDotProps {
  color?: string;
  tone?: "income" | "expense" | "accent" | "neutral" | "primary";
  size?: "xs" | "sm" | "md";
  className?: string;
  "aria-hidden"?: boolean;
}

const TONE_CLASSES: Record<NonNullable<ColorDotProps["tone"]>, string> = {
  income: "bg-finance-income",
  expense: "bg-finance-expense",
  accent: "bg-accent",
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
};

const SIZE_CLASSES: Record<NonNullable<ColorDotProps["size"]>, string> = {
  xs: "size-1.5",
  sm: "size-2",
  md: "size-2.5",
};

/**
 * Semantic colored status or category indicator dot.
 * Encapsulates rounded geometry and tokenized tone classes.
 */
export function ColorDot({
  color,
  tone,
  size = "md",
  className,
  "aria-hidden": ariaHidden = true,
}: ColorDotProps) {
  const toneClass = tone ? TONE_CLASSES[tone] : undefined;
  const sizeClass = SIZE_CLASSES[size];

  return (
    <span
      aria-hidden={ariaHidden}
      className={cn("shrink-0 rounded-full", sizeClass, toneClass, className)}
      style={color ? { backgroundColor: color } : undefined}
    />
  );
}
