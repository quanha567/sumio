import {
  Pagination as HeroUIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
  PaginationSummary,
  type PaginationRootProps,
} from "@heroui/react";
import type { ReactNode } from "react";

export interface PaginationProps extends Omit<PaginationRootProps, "children" | "onChange"> {
  page?: number;
  total?: number;
  onChange?: (page: number) => void;
  children?: ReactNode;
}

export function Pagination({
  page,
  total,
  onChange,
  children,
  className,
  ...props
}: PaginationProps) {
  if (children) {
    return (
      <HeroUIPagination className={className} {...props}>
        {children}
      </HeroUIPagination>
    );
  }

  if (page === undefined || total === undefined || !onChange) {
    return null;
  }

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <HeroUIPagination className={className} {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious isDisabled={page <= 1} onPress={() => page > 1 && onChange(page - 1)}>
            <PaginationPreviousIcon />
            <span>Prev</span>
          </PaginationPrevious>
        </PaginationItem>

        {pages.map((p) => {
          if (p === 1 || p === total || Math.abs(p - page) <= 1) {
            return (
              <PaginationItem key={p}>
                <PaginationLink isActive={p === page} onPress={() => onChange(p)}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          }
          if (p === page - 2 || p === page + 2) {
            return (
              <PaginationItem key={`ellipsis-${p}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}

        <PaginationItem>
          <PaginationNext
            isDisabled={page >= total}
            onPress={() => page < total && onChange(page + 1)}
          >
            <span>Next</span>
            <PaginationNextIcon />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </HeroUIPagination>
  );
}

Pagination.Root = PaginationRoot;
Pagination.Content = PaginationContent;
Pagination.Item = PaginationItem;
Pagination.Link = PaginationLink;
Pagination.Previous = PaginationPrevious;
Pagination.PreviousIcon = PaginationPreviousIcon;
Pagination.Next = PaginationNext;
Pagination.NextIcon = PaginationNextIcon;
Pagination.Ellipsis = PaginationEllipsis;
Pagination.Summary = PaginationSummary;

export {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNextIcon,
  PaginationPrevious,
  PaginationPreviousIcon,
  PaginationRoot,
  PaginationSummary,
};
