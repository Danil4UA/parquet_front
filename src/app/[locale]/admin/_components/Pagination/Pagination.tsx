import {
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ValidPageSizes } from "@/Utils/utils";

interface PaginationProps {
    pageIndex: number;
    pageCount: number;
    pageSize: number;
    rowCount: number;
    gotoPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    setPageSize: (size: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
  }

export default function Pagination({
  pageIndex,
  pageCount,
  pageSize,
  rowCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  canPreviousPage,
  canNextPage,
}: PaginationProps) {
  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, rowCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-2 py-1.5">
      <div className="text-xs text-gray-500">
        {from}–{to} of {rowCount}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 hidden sm:inline">Rows:</span>
          <select
            className="h-7 rounded border border-gray-300 bg-transparent px-1 text-xs"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {ValidPageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 p-0"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 p-0"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>
        <span className="text-xs text-gray-600 whitespace-nowrap px-1">
          {pageIndex + 1} / {Math.max(pageCount, 1)}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 p-0"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 p-0"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </Button>
        </div>
      </div>
    </div>
  );
}
