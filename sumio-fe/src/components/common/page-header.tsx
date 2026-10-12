import type { ReactNode } from "react";

import { cn, Heading, Text } from "@/components/ui";

export interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  badge,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <div className="flex flex-wrap items-center gap-2.5">
          {typeof title === "string" ? <Heading level={1}>{title}</Heading> : title}
          {badge}
        </div>
        {description && (
          <div className="mt-1">
            {typeof description === "string" ? (
              <Text variant="muted">{description}</Text>
            ) : (
              description
            )}
          </div>
        )}
      </div>

      {action && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:self-auto">{action}</div>
      )}
    </div>
  );
}
