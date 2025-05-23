"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, PlusCircle } from 'lucide-react';

import { ProductsSearchParams } from "@/types/products";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import GeneralTable from '@/components/Tables/GeneralTable';
import useGetAllProductsByCategory from '@/hooks/useGetAllProductsByCategory';
import createLeadsTableColumns from './_components/columns/productsTableColumns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Pagination from '../_components/Pagination/Pagination';
import { PaginationState } from '@tanstack/react-table';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const language = pathname.split("/")[1];
  
  const search = searchParams.get("search") || "";
  const color = searchParams.get("color") || "";
  const type = searchParams.get("type") || "";
  
  const apiParams: ProductsSearchParams = {
    category: 'all',
    search: searchTerm || search,
    color,
    type,
    language,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize
  };
  
  const { data, isPending } = useGetAllProductsByCategory(apiParams);
  
  const allProducts = useMemo(() => data?.data.products || [], [data?.data]);
  const pageCount = data?.data.pagination.pages || 0;
  const totalRows = data?.data.pagination.total || 0;

  const productTableColumns = useMemo(
    () => createLeadsTableColumns(),
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

  const handleAddProduct = () => {
    router.push(`/${language}/admin/add-product`);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, search]);

  return (
    <div className="flex w-full flex-col h-full max-h-[calc(100vh-58px)] gap-4 bg-white overflow-hidden">
      <div className="flex justify-end items-center gap-3 m-2">
        <div className="relative max-w-[300px] w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-1 py-0 text-sm h-[30px] w-full"
          />
        </div>
        <Button 
          onClick={handleAddProduct}
          size="sm" 
          className="flex items-center gap-1 h-[30px] bg-primary text-white hover:bg-primary/90"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Product</span>
        </Button>
      </div>
      <GeneralTable
        columns={productTableColumns}
        data={allProducts}
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