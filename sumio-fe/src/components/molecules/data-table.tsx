import type { ColumnDef, RowData, TableFeatures } from "@tanstack/react-table";
import { coreFeatures, FlexRender, useTable } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { ReactNode } from "react";
import { useRef } from "react";

import { Card, cn, Pagination, Spinner, Table, Text } from "@/components/atoms";

import { EmptyState } from "./empty-state";

export interface DataTablePagination {
  page: number;
  pageSize?: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<TData extends RowData> {
  data: TData[];
  columns: ColumnDef<TableFeatures, TData>[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  renderMobileRow?: (item: TData, index: number) => ReactNode;
  pagination?: DataTablePagination;
  estimatedMobileRowHeight?: number;
  className?: string;
  ariaLabel?: string;
}

export function DataTable<TData extends RowData>({
  data,
  columns,
  isLoading = false,
  emptyState,
  renderMobileRow,
  pagination,
  estimatedMobileRowHeight = 84,
  className,
  ariaLabel = "Data table",
}: DataTableProps<TData>) {
  const mobileParentRef = useRef<HTMLDivElement>(null);

  // TanStack Table v9 setup
  const table = useTable({
    data,
    columns,
    features: coreFeatures,
  });

  // Mobile Virtualizer for high-performance scroll list
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => mobileParentRef.current,
    estimateSize: () => estimatedMobileRowHeight,
    overscan: 5,
  });

  if (isLoading && data.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isLoading && data.length === 0 && emptyState) {
    return emptyState;
  }

  const defaultEmpty = (
    <EmptyState
      title="Không có dữ liệu"
      description="Hiện chưa có bản ghi nào để hiển thị."
      className="py-12"
    />
  );

  return (
    <div className={cn("w-full space-y-3", className)}>
      <Table.Adaptive
        desktop={
          <Table.Container>
            <Table variant="secondary" className="w-full">
              <Table.ScrollContainer>
                <Table.Content aria-label={ariaLabel} className="w-full">
                  <Table.Header>
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map((header) => (
                        <Table.Column key={header.id} id={header.id}>
                          {header.isPlaceholder ? null : <FlexRender header={header} />}
                        </Table.Column>
                      )),
                    )}
                  </Table.Header>

                  <Table.Body renderEmptyState={() => emptyState ?? defaultEmpty}>
                    {table.getRowModel().rows.map((row) => (
                      <Table.Row key={row.id} id={row.id}>
                        {row.getAllCells().map((cell) => (
                          <Table.Cell key={cell.id}>
                            <FlexRender cell={cell} />
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>

            {/* Desktop Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <Table.Footer>
                <Text variant="muted" size="xs">
                  {pagination.totalCount !== undefined
                    ? `Tổng số: ${pagination.totalCount} bản ghi`
                    : `Trang ${pagination.page} / ${pagination.totalPages}`}
                </Text>

                <Pagination
                  page={pagination.page}
                  total={pagination.totalPages}
                  onChange={pagination.onPageChange}
                />
              </Table.Footer>
            )}
          </Table.Container>
        }
        mobile={
          <div ref={mobileParentRef} className="max-h-[75vh] scrollbar-none overflow-y-auto">
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                position: "relative",
                width: "100%",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index];
                const item = data[virtualRow.index];

                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="pb-2.5"
                  >
                    {renderMobileRow ? (
                      renderMobileRow(item, virtualRow.index)
                    ) : (
                      <Card padding="sm">
                        <div className="flex flex-col gap-2">
                          {row
                            ? row.getAllCells().map((cell) => (
                                <div key={cell.id} className="flex items-center justify-between">
                                  <Text variant="muted" size="xs">
                                    {typeof cell.column.columnDef.header === "string"
                                      ? cell.column.columnDef.header
                                      : cell.column.id}
                                  </Text>
                                  <Text size="xs">
                                    <FlexRender cell={cell} />
                                  </Text>
                                </div>
                              ))
                            : null}
                        </div>
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        }
      />
    </div>
  );
}
