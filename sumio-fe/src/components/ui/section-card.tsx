import { cn } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "./button";
import { Card } from "./card";
import { Heading, Text } from "./typography";

interface SectionCardProps {
  title: string;
  description?: string;
  /** Rendered at the top-right, e.g. a <SectionLink /> or <SelectPill />. */
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

/** Standard dashboard card: title row + optional action + content. */
export function SectionCard({
  title,
  description,
  action,
  className,
  contentClassName,
  children,
}: SectionCardProps) {
  return (
    <Card className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Heading level={2}>{title}</Heading>
          {description && (
            <Text variant="muted" className="mt-0.5">
              {description}
            </Text>
          )}
        </div>
        {action}
      </div>
      <div className={cn("mt-4", contentClassName)}>{children}</div>
    </Card>
  );
}

interface SectionLinkProps {
  label: string;
  onPress?: () => void;
}

/** "View all >" style header action (HeroUI Button). */
export function SectionLink({ label, onPress }: SectionLinkProps) {
  return (
    <Button size="sm" variant="ghost" onPress={onPress} className="text-accent h-7 gap-0.5 px-2">
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </Button>
  );
}
