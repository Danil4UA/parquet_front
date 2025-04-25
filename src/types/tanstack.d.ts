/* eslint-disable @typescript-eslint/no-unused-vars */

import { FilterFn, RowData } from "@tanstack/react-table";
import { RankingInfo } from "@tanstack/match-sorter-utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnClass?: string;
    headerClass?: string;
    cellClass?: string;
  }

  interface FilterMeta {
    itemRank?: RankingInfo
  }
}
