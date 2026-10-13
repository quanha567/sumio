import {
  Card as HeroUICard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot as HeroUICardRoot,
  CardTitle,
  type CardContentProps,
  type CardDescriptionProps,
  type CardFooterProps,
  type CardHeaderProps,
  type CardProps as HeroUICardProps,
  type CardRootProps,
  type CardTitleProps,
} from "@heroui/react";
import { cardVariants, tv, type VariantProps } from "@heroui/styles";
import type { ReactNode } from "react";

import { cn } from "./cn";
import { Heading, Text } from "./typography";

export const customCardVariants = tv({
  extend: cardVariants,
  base: "rounded-card bg-surface border border-border shadow-xs transition-all",
  variants: {
    intent: {
      default: "",
      raised: "bg-surface-raised shadow-sm",
      secondary: "bg-surface-secondary border-transparent shadow-none",
      sunken: "bg-surface-sunken border-transparent shadow-none",
    },
    padding: {
      none: "p-0",
      sm: "p-3.5 sm:p-4",
      md: "p-4 sm:p-5",
      lg: "p-5 sm:p-6 md:p-8",
    },
  },
  defaultVariants: {
    intent: "default",
    padding: "none",
  },
});

export type CustomCardVariants = VariantProps<typeof customCardVariants>;

export interface CardProps
  extends Omit<HeroUICardProps, "className" | "title">, CustomCardVariants {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

function CardBase({
  intent,
  padding,
  title,
  subtitle,
  action,
  children,
  className,
  headerClassName,
  contentClassName,
  ...props
}: CardProps) {
  const slots = customCardVariants({ intent, padding });
  const baseClass = typeof slots === "object" && "base" in slots ? slots.base() : "";

  if (title || subtitle || action) {
    return (
      <HeroUICard className={cn(baseClass, className)} {...props}>
        <div
          className={cn(
            "flex items-center justify-between gap-4 p-4 sm:p-5 border-b border-border/60",
            headerClassName,
          )}
        >
          <div className="min-w-0">
            {typeof title === "string" ? <Heading level={2}>{title}</Heading> : title}
            {subtitle && (
              <div className="mt-0.5">
                {typeof subtitle === "string" ? <Text variant="muted">{subtitle}</Text> : subtitle}
              </div>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        <div className={cn("p-4 sm:p-5", contentClassName)}>{children}</div>
      </HeroUICard>
    );
  }

  return (
    <HeroUICard className={cn(baseClass, className)} {...props}>
      {children}
    </HeroUICard>
  );
}

export const Card = Object.assign(CardBase, {
  Root: HeroUICardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export const CardRoot = HeroUICardRoot;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export type {
  CardRootProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  CustomCardVariants as CardVariants,
};
export { cardVariants } from "@heroui/styles";
