import {
  Breadcrumbs as HeroUIBreadcrumbs,
  BreadcrumbsItem as HeroUIBreadcrumbsItem,
  BreadcrumbsRoot,
} from "@heroui/react";
import { breadcrumbsVariants, tv, type VariantProps } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customBreadcrumbsVariants = tv({
  extend: breadcrumbsVariants,
  base: "text-xs sm:text-sm text-muted",
});

export type CustomBreadcrumbsVariants = VariantProps<typeof customBreadcrumbsVariants>;

function BreadcrumbsBase({ className, ...props }: ComponentProps<typeof HeroUIBreadcrumbs>) {
  return <HeroUIBreadcrumbs className={cn(customBreadcrumbsVariants(), className)} {...props} />;
}

function BreadcrumbItemBase({ className, ...props }: ComponentProps<typeof HeroUIBreadcrumbsItem>) {
  return (
    <HeroUIBreadcrumbsItem
      className={cn(
        "hover:text-foreground data-[current=true]:text-foreground data-[current=true]:font-semibold transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export const Breadcrumbs = Object.assign(BreadcrumbsBase, {
  Root: BreadcrumbsRoot,
  Item: BreadcrumbItemBase,
});

export const BreadcrumbItem = BreadcrumbItemBase;
export const BreadcrumbsItem = BreadcrumbItemBase;

export { BreadcrumbsRoot };

export type { BreadcrumbsProps, BreadcrumbsItemProps } from "@heroui/react";
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbItemBase>;
export { breadcrumbsVariants };
export type BreadcrumbsVariants = CustomBreadcrumbsVariants;
