import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "./button";
import { Card } from "./card";
import { cn } from "./cn";
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
    <Card padding="md" className={className}>
      <Card.Header className="flex flex-row items-center justify-between gap-3 p-0">
        <div className="min-w-0">
          <Card.Title>
            <Heading level={2}>{title}</Heading>
          </Card.Title>
          {description && (
            <Card.Description>
              <Text variant="muted" className="mt-0.5">
                {description}
              </Text>
            </Card.Description>
          )}
        </div>
        {action}
      </Card.Header>
      <Card.Content className={cn("mt-4 p-0", contentClassName)}>{children}</Card.Content>
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
    <Button
      size="sm"
      intent="ghost"
      onPress={onPress}
      className="text-accent hover:text-accent-hover h-7 gap-0.5 px-2 font-medium"
    >
      {label}
      <ChevronRight className="h-3.5 w-3.5" />
    </Button>
  );
}
