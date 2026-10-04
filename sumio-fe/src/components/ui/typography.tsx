import { cn } from "@heroui/react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { type Tone, toneStyles } from "./tone";

/* -------------------------------------------------------------------------
 * Heading Primitive
 * ------------------------------------------------------------------------- */

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}

const headingStyles: Record<1 | 2 | 3, string> = {
  1: "text-xl font-bold text-foreground sm:text-2xl tracking-tight leading-tight",
  2: "text-sm font-bold text-foreground sm:text-base leading-snug",
  3: "text-xs font-semibold text-foreground sm:text-sm leading-snug",
};

export function Heading({ level = 2, children, className, ...props }: HeadingProps) {
  const Tag = (`h${level}` as ElementType) || "h2";
  return (
    <Tag className={cn(headingStyles[level], className)} {...props}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Text Primitive
 * ------------------------------------------------------------------------- */

export type TextVariant = "body" | "muted" | "caption";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div";
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
}

const textStyles: Record<TextVariant, string> = {
  body: "text-sm font-normal text-foreground leading-normal",
  muted: "text-xs font-normal text-muted leading-normal",
  caption: "text-[11px] font-medium text-muted leading-tight",
};

export function Text({ as = "p", variant = "body", children, className, ...props }: TextProps) {
  const Tag = as;
  return (
    <Tag className={cn(textStyles[variant], className)} {...props}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Metric Primitive (Tabular Numbers for Financial Values)
 * ------------------------------------------------------------------------- */

export type MetricSize = "lg" | "md" | "sm";

export interface MetricProps extends HTMLAttributes<HTMLSpanElement> {
  value: ReactNode;
  size?: MetricSize;
  tone?: Tone;
  className?: string;
}

const metricSizes: Record<MetricSize, string> = {
  lg: "text-2xl font-bold sm:text-3xl tracking-tight",
  md: "text-lg font-bold sm:text-xl tracking-tight",
  sm: "text-xs font-semibold sm:text-sm",
};

export function Metric({ value, size = "md", tone, className, ...props }: MetricProps) {
  const toneClass = tone ? toneStyles[tone].text : "text-foreground";
  return (
    <span
      className={cn("tabular-nums font-sans", metricSizes[size], toneClass, className)}
      {...props}
    >
      {value}
    </span>
  );
}
