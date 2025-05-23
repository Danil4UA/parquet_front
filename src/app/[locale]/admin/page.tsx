"use client";

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import useGetAllOrdersQuery from '@/hooks/useGetAllOrdersQuery';
import { useSession } from 'next-auth/react';
import GeneralTable from '@/components/Tables/GeneralTable';
import createOrdersTableColumns from './_components/columns/ordersTableColumns';
import { PaginationState } from '@tanstack/react-table';
import Pagination from './_components/Pagination/Pagination';
import { useSearchParams } from 'next/navigation';
import { OrdersSearchParams } from '@/types/orders';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const apiParams: OrdersSearchParams = {
    search: searchTerm || search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize
  };
  
  const { data: session } = useSession();
  const { data, isPending } = useGetAllOrdersQuery(session, apiParams);
  const allOrders = useMemo(() => data?.data.orders || [], [data?.data]);

  const pageCount = data?.data?.pagination?.pages || 0;
  const totalRows = data?.data?.pagination?.total || 0;

  const ordersTableColumns = useMemo(
    () => createOrdersTableColumns(),
    [],
  );

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: newPage,
    }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({
      pageIndex: 0,
      pageSize: newPageSize,
    });
  };

  return (
    <div className="flex w-full flex-col h-full max-h-[calc(100vh-58px)] gap-4 bg-white overflow-hidden">
      <div className="flex justify-end items-center gap-3 m-2">
        <div className="relative max-w-[300px] w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-1 py-0 text-sm h-[30px] w-full"
          />
        </div>
      </div>
      <GeneralTable
        columns={ordersTableColumns}
        data={allOrders}
        isPending={isPending}
        showBorders
        rowIdField="_id"
        cellClass="text-gray-800"
        headerClass="text-gray-900 bg-gray-50 border-r last:border-r-0 uppercase"
        wrapperTableClass="border"
      />
      <Pagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        pageCount={pageCount}
        rowCount={totalRows}
        gotoPage={handlePageChange}
        nextPage={() => handlePageChange(pagination.pageIndex + 1)}
        previousPage={() => handlePageChange(pagination.pageIndex - 1)}
        setPageSize={handlePageSizeChange}
        canPreviousPage={pagination.pageIndex > 0}
        canNextPage={pagination.pageIndex < pageCount - 1}
      />
    </div>
  );
}