import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn, Heading, Text } from "@/components/ui";

export interface EmptyStateProps extends Omit<ComponentProps<"div">, "title"> {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "dashed" | "solid" | "clean";
  className?: string;
}

const variantStyles: Record<"dashed" | "solid" | "clean", string> = {
  dashed: "border-dashed border-border/80 bg-surface/50",
  solid: "border-border bg-surface",
  clean: "border-transparent bg-transparent",
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = "dashed",
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border p-8 text-center sm:p-12",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {Icon && (
        <div className="bg-surface-secondary text-muted mb-4 grid size-12 place-items-center rounded-xl">
          <Icon className="size-6" />
        </div>
      )}

      {typeof title === "string" ? (
        <Heading level={3} className="text-foreground">
          {title}
        </Heading>
      ) : (
        title
      )}

      {description && (
        <div className="mt-1.5 max-w-sm text-center">
          {typeof description === "string" ? (
            <Text variant="muted">{description}</Text>
          ) : (
            description
          )}
        </div>
      )}

      {action && <div className="mt-6">{action}</div>}
      {children}
    </div>
  );
}
