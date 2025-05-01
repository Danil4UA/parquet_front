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
  return (
    <div className="flex items-center justify-between px-2 pt-4">
      <div className="flex-1 text-sm text-gray-500">
        Showing
        {" "}
        {pageIndex * pageSize + 1}
        {" "}
        to
        {" "}
        {Math.min((pageIndex + 1) * pageSize, rowCount)}
        {" "}
        of
        {" "}
        {rowCount}
        {" "}
        results
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <select
            className="h-8 w-16 rounded border border-gray-300 bg-white px-2 text-sm"
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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <span className="text-sm text-gray-700">
            Page
            {" "}
            {pageIndex + 1}
            {" "}
            of
            {" "}
            {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-0"
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
