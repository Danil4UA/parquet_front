import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { cn } from "@/lib/utils";
  import { StringKeys } from "@/types/generalTypes";
  import getTableOptionsConfig from "@/Utils/getTableOptionsConfig";
  import {
    ColumnDef,
    ColumnFiltersState,
    ColumnSizingState,
    flexRender,
    OnChangeFn,
    PaginationState,
    Row,
    RowSelectionState,
    SortingState,
    useReactTable,
  } from "@tanstack/react-table";
  import React from "react";
  import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
  import { cva } from "class-variance-authority";
  import LoadingSpinner from "@/components/LoadingSpinner"
  
  const cellBorderStyles = cva("px-2 py-2 whitespace-normal", {
    variants: {
      borders: {
        true: "border-r last:border-r-0",
        false: "",
      },
    },
    defaultVariants: {
      borders: true,
    },
  });
  
  type tGeneralTable<TState, TData extends TState, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isPending: boolean;
    customNoResultsMessage?: string;
    handleRowClick?: (row: Row<any>) => void;
    headerClass?: string;
    cellClass?: string;
    rowClass?: string;
    rowSelection?: RowSelectionState;
    setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
    rowIdField?: StringKeys<TData>;
    sorting?: SortingState;
    setSorting?: React.Dispatch<React.SetStateAction<SortingState>>;
    columnFilters?: ColumnFiltersState;
    setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    useStripedRows?: boolean;
    showBorders?: boolean;
    columnSizing?: ColumnSizingState;
    onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
    pagination?: PaginationState;
    setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
    pageCount?: number;
    tableClass?: string;
    wrapperTableClass?: string;
  };
  
  export default function GeneralTable<TState, TData extends TState, TValue>({
    columns,
    data,
    isPending,
    customNoResultsMessage,
    handleRowClick,
    headerClass,
    cellClass,
    rowClass,
    rowSelection,
    setRowSelection,
    rowIdField,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    useStripedRows = false,
    showBorders = true,
    columnSizing,
    onColumnSizingChange,
    pagination,
    setPagination,
    pageCount,
    tableClass,
    wrapperTableClass,
  }: tGeneralTable<TState, TData, TValue>) {
    const table = useReactTable(
      getTableOptionsConfig({
        data,
        columns,
        rowSelection,
        setRowSelection,
        rowIdField,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnSizing,
        onColumnSizingChange,
        pagination,
        setPagination,
        pageCount,
      }),
    );
  
    return (
      <Table
        className={cn("table-fixed border-collapse bg-white", tableClass)}
        wrapperTableClass={wrapperTableClass}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    `relative px-2 ${
                      sorting ? "cursor-pointer select-none" : ""
                    }`,
                    headerClass,
                    header.column.columnDef.meta?.columnClass ?? "",
                    header.column.columnDef.meta?.headerClass ?? "",
                  )}
                  style={{ width: header.getSize() }}
                  onClick={setSorting && header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex w-full items-center justify-between gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {sorting && header.column.getCanSort() ? (
                        /* eslint-disable-next-line react/jsx-no-useless-fragment */
                        <>
                          {{
                            asc: <ArrowUp size={15} />,
                            desc: <ArrowDown size={15} />,
                          }[header.column.getIsSorted() as string] ?? (
                            <ArrowUpDown size={15} />
                          )}
                        </>
                      ) : null}
                      {header.column.getCanResize() && (
                        <div
                          role="presentation"
                          onMouseDown={header.getResizeHandler()}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute right-0 top-1/2 z-10 h-full w-[3px] -translate-y-1/2 cursor-col-resize touch-none select-none bg-transparent hover:bg-gray-400"
                        />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isPending ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <LoadingSpinner />
              </TableCell>
            </TableRow>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      useStripedRows && "odd:bg-gray-100 even:bg-white",
                      handleRowClick && "cursor-pointer",
                      rowClass,
                    )}
                    onClick={() => {
                      if (handleRowClick) {
                        handleRowClick(row);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cellBorderStyles({ borders: showBorders }),
                          cellClass,
                          cell.column.columnDef.meta?.columnClass ?? "",
                          cell.column.columnDef.meta?.cellClass ?? "",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {customNoResultsMessage || "No Results"}
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    );
  }
  