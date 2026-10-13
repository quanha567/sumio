import {
  Link as HeroUILink,
  LinkIcon,
  LinkRoot,
  type LinkProps as HeroUILinkProps,
} from "@heroui/react";
import { linkVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customLinkVariants = tv({
  extend: linkVariants,
  base: "font-medium transition-colors cursor-pointer inline-flex items-center gap-1",
  variants: {
    intent: {
      accent: "text-accent hover:underline",
      muted: "text-muted hover:text-foreground",
      primary: "text-primary hover:underline",
    },
  },
  defaultVariants: {
    intent: "accent",
  },
});

export type CustomLinkVariants = VariantProps<typeof customLinkVariants>;

export interface LinkProps extends HeroUILinkProps {
  className?: string;
  intent?: "accent" | "muted" | "primary";
}

function BaseLink({ className, intent = "accent", ...props }: LinkProps) {
  return <HeroUILink className={cn(customLinkVariants({ intent }).base(), className)} {...props} />;
}

export function linkStyles(options?: Parameters<typeof customLinkVariants>[0]): string {
  return customLinkVariants(options).base();
}

export const Link = Object.assign(BaseLink, {
  Root: LinkRoot,
  Icon: LinkIcon,
});

export { LinkRoot, LinkIcon };
export { linkVariants };
export type LinkVariants = CustomLinkVariants;
