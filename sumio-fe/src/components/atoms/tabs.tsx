import {
  Tab,
  TabIndicator,
  TabList,
  TabListContainer,
  TabPanel,
  TabSeparator,
  Tabs as HeroUITabs,
  TabsRoot as HeroUITabsRoot,
  type TabsProps as HeroUITabsProps,
} from "@heroui/react";
import { tabsVariants, tv, type VariantProps } from "@heroui/styles";

import { cn } from "./cn";

export const customTabsVariants = tv({
  extend: tabsVariants,
  slots: {
    tabList: "gap-1 border-b border-border p-0 bg-transparent",
    tab: "font-medium text-muted hover:text-foreground transition-colors py-2 px-3 data-selected:text-accent data-selected:font-semibold",
    tabIndicator: "bg-accent h-0.5 rounded-full",
  },
});

export type CustomTabsVariants = VariantProps<typeof customTabsVariants>;

export interface TabsProps extends HeroUITabsProps {
  className?: string;
}

function TabsBase({ className, ...props }: TabsProps) {
  const slots = customTabsVariants();
  return <HeroUITabs className={cn(slots.base?.(), className)} {...props} />;
}

export const Tabs = Object.assign(TabsBase, {
  Root: HeroUITabsRoot,
  List: TabList,
  ListContainer: TabListContainer,
  Tab,
  Indicator: TabIndicator,
  Separator: TabSeparator,
  Panel: TabPanel,
});

export const TabsRoot = HeroUITabsRoot;
export { Tab, TabIndicator, TabList, TabListContainer, TabPanel, TabSeparator };
export type {
  TabsRootProps,
  TabListProps,
  TabListContainerProps,
  TabProps,
  TabIndicatorProps,
  TabSeparatorProps,
  TabPanelProps,
} from "@heroui/react";
export type { CustomTabsVariants as TabsVariants };
export { tabsVariants } from "@heroui/styles";
