import { cn } from "@heroui/react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { type Tone, toneStyles } from "./tone";

/* -------------------------------------------------------------------------
 * Heading Primitive
 * ------------------------------------------------------------------------- */

export type HeadingVariant = "default" | "display";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  variant?: HeadingVariant;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const headingStyles: Record<1 | 2 | 3 | 4, string> = {
  1: "text-xl font-bold text-foreground sm:text-2xl tracking-tight leading-tight",
  2: "text-sm font-semibold text-foreground sm:text-base leading-snug",
  3: "text-xs font-semibold text-foreground sm:text-sm leading-snug",
  4: "text-xs font-medium text-foreground leading-snug",
};

const displayHeadingStyles: Record<1 | 2 | 3 | 4, string> = {
  1: "text-4xl font-serif sm:text-5xl lg:text-6xl tracking-tight leading-tight",
  2: "text-2xl font-serif sm:text-3xl lg:text-4xl tracking-tight leading-tight",
  3: "text-xl font-serif sm:text-2xl tracking-tight leading-snug",
  4: "text-lg font-serif sm:text-xl leading-snug",
};

export function Heading({
  level = 2,
  variant = "default",
  tone,
  children,
  className,
  ...props
}: HeadingProps) {
  const Tag = (`h${level}` as ElementType) || "h2";
  const baseStyle = variant === "display" ? displayHeadingStyles[level] : headingStyles[level];
  const toneClass = tone ? toneStyles[tone].text : "";

  return (
    <Tag className={cn(baseStyle, toneClass, className)} {...props}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Text Primitive
 * ------------------------------------------------------------------------- */

export type TextVariant = "body" | "body-sm" | "muted" | "caption" | "label" | "error";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextSize = "xs" | "sm" | "base" | "lg";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "label";
  variant?: TextVariant;
  weight?: TextWeight;
  size?: TextSize;
  children: ReactNode;
  className?: string;
}

const textStyles: Record<TextVariant, string> = {
  body: "text-sm text-foreground leading-normal",
  "body-sm": "text-xs text-foreground leading-normal",
  muted: "text-xs text-muted leading-normal",
  caption: "text-[11px] text-muted leading-tight",
  label: "text-xs text-foreground leading-tight",
  error: "text-xs text-danger leading-tight",
};

const textSizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
};

const weightStyles: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function Text({
  as = "p",
  variant = "body",
  weight,
  size,
  children,
  className,
  ...props
}: TextProps) {
  const Tag = as;
  const defaultWeight =
    variant === "label" ? "font-semibold" : variant === "caption" ? "font-medium" : "font-normal";
  const appliedWeight = weight ? weightStyles[weight] : defaultWeight;
  const appliedSize = size ? textSizeStyles[size] : "";

  return (
    <Tag className={cn(textStyles[variant], appliedSize, appliedWeight, className)} {...props}>
      {children}
    </Tag>
  );
}

/* -------------------------------------------------------------------------
 * Metric Primitive (Tabular Numbers for Financial Values)
 * ------------------------------------------------------------------------- */

export type MetricSize = "lg" | "md" | "sm" | "xs";
export type MetricTrend = "income" | "expense" | "neutral" | "pending";

export interface MetricProps extends HTMLAttributes<HTMLSpanElement> {
  value: ReactNode;
  size?: MetricSize;
  tone?: Tone;
  trend?: MetricTrend;
  className?: string;
}

const metricSizes: Record<MetricSize, string> = {
  lg: "text-2xl font-bold sm:text-3xl tracking-tight",
  md: "text-lg font-bold sm:text-xl tracking-tight",
  sm: "text-xs font-semibold sm:text-sm",
  xs: "text-[11px] font-semibold",
};

const trendClasses: Record<MetricTrend, string> = {
  income: "text-finance-income",
  expense: "text-finance-expense",
  neutral: "text-finance-neutral",
  pending: "text-finance-pending",
};

export function Metric({ value, size = "md", tone, trend, className, ...props }: MetricProps) {
  const toneClass = trend ? trendClasses[trend] : tone ? toneStyles[tone].text : "text-foreground";

  return (
    <span
      className={cn(
        "tabular-nums font-features-['tnum'_1,'lnum'_1] font-sans",
        metricSizes[size],
        toneClass,
        className,
      )}
      {...props}
    >
      {value}
    </span>
  );
}
