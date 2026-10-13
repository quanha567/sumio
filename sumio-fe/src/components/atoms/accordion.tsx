import {
  Accordion as HeroUIAccordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem as HeroUIAccordionItem,
  AccordionPanel as HeroUIAccordionPanel,
  AccordionRoot,
  AccordionTrigger as HeroUIAccordionTrigger,
  Disclosure,
  DisclosureBody,
  DisclosureContent,
  DisclosureGroup,
  DisclosureGroupRoot,
  DisclosureHeading,
  DisclosureIndicator,
  DisclosureRoot,
  DisclosureTrigger,
} from "@heroui/react";
import { accordionVariants, disclosureGroupVariants, disclosureVariants, tv } from "@heroui/styles";
import type { ComponentProps } from "react";

import { cn } from "./cn";

export const customAccordionVariants = tv({
  extend: accordionVariants,
  base: "border border-border rounded-xl bg-surface divide-y divide-border overflow-hidden",
});

function AccordionBase({ className, ...props }: ComponentProps<typeof HeroUIAccordion>) {
  return <HeroUIAccordion className={cn(customAccordionVariants(), className)} {...props} />;
}

function AccordionItemBase({ className, ...props }: ComponentProps<typeof HeroUIAccordionItem>) {
  return <HeroUIAccordionItem className={cn("transition-colors", className)} {...props} />;
}

function AccordionTriggerBase({
  className,
  ...props
}: ComponentProps<typeof HeroUIAccordionTrigger>) {
  return (
    <HeroUIAccordionTrigger
      className={cn(
        "px-4 py-3.5 text-sm font-medium text-foreground hover:bg-surface-secondary/50 transition-colors cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

function AccordionPanelBase({ className, ...props }: ComponentProps<typeof HeroUIAccordionPanel>) {
  return (
    <HeroUIAccordionPanel
      className={cn("px-4 pb-4 pt-1 text-sm text-muted", className)}
      {...props}
    />
  );
}

export const Accordion = Object.assign(AccordionBase, {
  Root: AccordionRoot,
  Item: AccordionItemBase,
  Heading: AccordionHeading,
  Trigger: AccordionTriggerBase,
  Panel: AccordionPanelBase,
  Indicator: AccordionIndicator,
  Body: AccordionBody,
});

export const AccordionItem = AccordionItemBase;
export const AccordionTrigger = AccordionTriggerBase;
export const AccordionPanel = AccordionPanelBase;

export {
  AccordionRoot,
  AccordionHeading,
  AccordionIndicator,
  AccordionBody,
  Disclosure,
  DisclosureRoot,
  DisclosureHeading,
  DisclosureTrigger,
  DisclosureContent,
  DisclosureBody,
  DisclosureIndicator,
  DisclosureGroup,
  DisclosureGroupRoot,
};

export type {
  AccordionProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionPanelProps,
  DisclosureProps,
  DisclosureGroupProps,
} from "@heroui/react";
export { accordionVariants, disclosureVariants, disclosureGroupVariants };
