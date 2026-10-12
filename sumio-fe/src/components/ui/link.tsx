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
  base: "text-accent hover:underline font-medium transition-colors cursor-pointer inline-flex items-center gap-1",
});

export type CustomLinkVariants = VariantProps<typeof customLinkVariants>;

export interface LinkProps extends HeroUILinkProps {
  className?: string;
}

function BaseLink({ className, ...props }: LinkProps) {
  return <HeroUILink className={cn(customLinkVariants(), className)} {...props} />;
}

export const Link = Object.assign(BaseLink, {
  Root: LinkRoot,
  Icon: LinkIcon,
});

export { LinkRoot, LinkIcon };
export { linkVariants };
export type LinkVariants = CustomLinkVariants;
