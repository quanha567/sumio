import {
  Badge as HeroUIBadge,
  BadgeAnchor,
  BadgeLabel,
  BadgeRoot as HeroUIBadgeRoot,
  type BadgeAnchorProps,
  type BadgeLabelProps,
  type BadgeProps as HeroUIBadgeProps,
  type BadgeRootProps,
} from "@heroui/react";
import { badgeVariants, tv, type VariantProps } from "@heroui/styles";

export const customBadgeVariants = tv({
  extend: badgeVariants,
  base: "inline-flex items-center justify-center font-medium",
  variants: {
    intent: {
      accent: "bg-accent text-accent-foreground",
      success: "bg-success text-success-foreground",
      income: "bg-finance-income text-white",
      danger: "bg-danger text-danger-foreground",
      expense: "bg-finance-expense text-white",
      warning: "bg-warning text-warning-foreground",
      pending: "bg-finance-pending text-white",
      neutral: "bg-surface-secondary text-foreground",
      sand: "bg-sand text-sand-foreground",
    },
  },
  defaultVariants: {
    intent: "accent",
  },
});

export type CustomBadgeVariants = VariantProps<typeof customBadgeVariants>;

export interface BadgeProps extends Omit<HeroUIBadgeProps, "className">, CustomBadgeVariants {
  className?: string;
}

function resolveBadgeColor(
  intent?: CustomBadgeVariants["intent"],
  color?: HeroUIBadgeProps["color"],
): HeroUIBadgeProps["color"] {
  if (color) return color;
  if (intent === "danger" || intent === "expense") return "danger";
  if (intent === "success" || intent === "income") return "success";
  if (intent === "warning" || intent === "pending") return "warning";
  if (intent === "accent") return "accent";
  return undefined;
}

function BadgeBase({ intent, color, className, ...props }: BadgeProps) {
  const resolvedColor = resolveBadgeColor(intent, color);

  return <HeroUIBadge color={resolvedColor} className={className} {...props} />;
}

export const Badge = Object.assign(BadgeBase, {
  Root: HeroUIBadgeRoot,
  Anchor: BadgeAnchor,
  Label: BadgeLabel,
});

export const BadgeRoot = HeroUIBadgeRoot;
export { BadgeAnchor, BadgeLabel };
export type {
  BadgeAnchorProps,
  BadgeLabelProps,
  BadgeRootProps,
  CustomBadgeVariants as BadgeVariants,
};
export { badgeVariants } from "@heroui/styles";
