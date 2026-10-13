import {
  ListBox as HeroUIListBox,
  ListBoxItem as HeroUIListBoxItem,
  ListBoxItemIndicator,
  ListBoxItemRoot,
  ListBoxLoadMoreItem,
  ListBoxRoot,
  ListBoxSection,
  ListBoxSectionRoot,
} from "@heroui/react";
import {
  listboxItemVariants,
  listboxSectionVariants,
  listboxVariants,
  tv,
  type VariantProps,
} from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customListBoxVariants = tv({
  extend: listboxVariants,
  base: "p-1 outline-none",
});

export const customListBoxItemVariants = tv({
  extend: listboxItemVariants,
  base: "rounded-sm transition-colors text-foreground text-sm hover:bg-surface-secondary data-[focused=true]:bg-surface-secondary data-[selected=true]:text-accent data-[selected=true]:font-semibold outline-none cursor-pointer",
});

export type CustomListBoxVariants = VariantProps<typeof customListBoxVariants>;
export type CustomListBoxItemVariants = VariantProps<typeof customListBoxItemVariants>;

function ListBoxBase({ className, ...props }: ComponentProps<typeof HeroUIListBox>) {
  return <HeroUIListBox className={cn(customListBoxVariants(), className)} {...props} />;
}

function ListBoxItemBase({ className, ...props }: ComponentProps<typeof HeroUIListBoxItem>) {
  return <HeroUIListBoxItem className={cn(customListBoxItemVariants(), className)} {...props} />;
}

export const ListBox = Object.assign(ListBoxBase, {
  Root: ListBoxRoot,
  Item: ListBoxItemBase,
  ItemIndicator: ListBoxItemIndicator,
  ItemRoot: ListBoxItemRoot,
  LoadMoreItem: ListBoxLoadMoreItem,
  Section: ListBoxSection,
  SectionRoot: ListBoxSectionRoot,
});

export const ListBoxItem = ListBoxItemBase;

export {
  ListBoxRoot,
  ListBoxItemIndicator,
  ListBoxItemRoot,
  ListBoxLoadMoreItem,
  ListBoxSection,
  ListBoxSectionRoot,
};

export type { ListBoxProps, ListBoxRootProps } from "@heroui/react";
export { listboxVariants, listboxItemVariants, listboxSectionVariants };
export type ListBoxVariants = CustomListBoxVariants;
