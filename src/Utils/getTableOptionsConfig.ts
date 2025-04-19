import { StringKeys } from "@/types/generalTypes";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  TableOptions,
  TableState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import React from "react";

type tGetTableOptionsConfig<TState, TData extends TState, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  rowIdField?: StringKeys<TData>;
  sorting?: SortingState
  setSorting?: React.Dispatch<React.SetStateAction<SortingState>>
  columnFilters?: ColumnFiltersState
  setColumnFilters?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>;
  pagination?: PaginationState;
  setPagination?: React.Dispatch<React.SetStateAction<PaginationState>>;
  pageCount?: number;
};

export default function getTableOptionsConfig<TState, TData extends TState, TValue>({
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
}: tGetTableOptionsConfig<TState, TData, TValue>): TableOptions<TData> {
  const reactTableConfig: TableOptions<TData> = {
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  };

  const state: Partial<TableState> = {};

  if (rowSelection && setRowSelection) {
    reactTableConfig.onRowSelectionChange = setRowSelection;
    state.rowSelection = rowSelection;
  }

  if (rowIdField) {
    reactTableConfig.getRowId = (row) => String(row[rowIdField]);
  }

  if (sorting && setSorting) {
    reactTableConfig.getSortedRowModel = getSortedRowModel();
    reactTableConfig.onSortingChange = setSorting;
    state.sorting = sorting;
    reactTableConfig.enableSortingRemoval = false;
  }

  if (columnFilters && setColumnFilters) {
    reactTableConfig.getFilteredRowModel = getFilteredRowModel();
    state.columnFilters = columnFilters;
    reactTableConfig.onColumnFiltersChange = setColumnFilters;
  }

  if (columnSizing) {
    state.columnSizing = columnSizing;
  }

  if (onColumnSizingChange) {
    reactTableConfig.onColumnSizingChange = onColumnSizingChange;
  }

  if (pagination && setPagination) {
    reactTableConfig.getPaginationRowModel = getPaginationRowModel();
    reactTableConfig.onPaginationChange = setPagination;
    state.pagination = pagination;
    if (pageCount !== undefined) {
      reactTableConfig.manualPagination = true;
      reactTableConfig.pageCount = pageCount;
    }
  }

  if (Object.keys(state).length > 0) {
    reactTableConfig.state = state;
  }

  return reactTableConfig;
}
