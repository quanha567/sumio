import { Skeleton } from "@/components/ui";

export function TransactionTableSkeleton() {
  return (
    <div className="space-y-4 p-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="border-border/40 flex items-center justify-between gap-4 border-b py-2 last:border-0"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="size-4" />
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="size-7 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
