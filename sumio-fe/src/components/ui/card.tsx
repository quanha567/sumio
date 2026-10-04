import {
  Card as HeroUICard,
  CardContent as HeroUICardContent,
  CardDescription as HeroUICardDescription,
  CardFooter as HeroUICardFooter,
  CardHeader as HeroUICardHeader,
  CardTitle as HeroUICardTitle,
  cn,
} from "@heroui/react";
import type { ComponentProps } from "react";

export type CardProps = ComponentProps<typeof HeroUICard>;
export type CardHeaderProps = ComponentProps<typeof HeroUICardHeader>;
export type CardTitleProps = ComponentProps<typeof HeroUICardTitle>;
export type CardDescriptionProps = ComponentProps<typeof HeroUICardDescription>;
export type CardContentProps = ComponentProps<typeof HeroUICardContent>;
export type CardFooterProps = ComponentProps<typeof HeroUICardFooter>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <HeroUICard
      className={cn(
        "rounded-xl border border-border bg-surface text-surface-foreground shadow-xs transition-all duration-200",
        className,
      )}
      {...props}
    >
      {children}
    </HeroUICard>
  );
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <HeroUICardHeader className={cn("p-4 pb-2.5 sm:p-5 sm:pb-3", className)} {...props}>
      {children}
    </HeroUICardHeader>
  );
}

export function CardTitle({ className, children, ...props }: CardTitleProps) {
  return (
    <HeroUICardTitle
      className={cn("text-sm font-semibold text-foreground sm:text-base", className)}
      {...props}
    >
      {children}
    </HeroUICardTitle>
  );
}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <HeroUICardDescription className={cn("text-xs text-muted", className)} {...props}>
      {children}
    </HeroUICardDescription>
  );
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <HeroUICardContent className={cn("p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props}>
      {children}
    </HeroUICardContent>
  );
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <HeroUICardFooter className={cn("p-4 pt-0 sm:p-5 sm:pt-0", className)} {...props}>
      {children}
    </HeroUICardFooter>
  );
}
