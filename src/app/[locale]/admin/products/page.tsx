"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, PlusCircle } from 'lucide-react';

import { InteriorPhotoFilter, ProductsSearchParams } from "@/types/products";
import { usePathname, useRouter } from "next/navigation";
import GeneralTable from '@/components/Tables/GeneralTable';
import useGetAllProductsByCategory from '@/hooks/useGetAllProductsByCategory';
import createLeadsTableColumns from './_components/columns/productsTableColumns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '../_components/Pagination/Pagination';
import { PaginationState } from '@tanstack/react-table';
import RouteConstants from '@/constants/RouteConstants';
import { categoryOptions, allowedTypes } from '@/Utils/productsUtils';

const SEARCH_DEBOUNCE_MS = 400;
const ALL = 'all';
const DEFAULT_SORT = 'newest';

const sortOptions = [
  { id: 'newest', name: 'Newest first' },
  { id: 'oldest', name: 'Oldest first' },
  { id: 'price_asc', name: 'Price: low to high' },
  { id: 'price_desc', name: 'Price: high to low' },
  { id: 'name_asc', name: 'Name: A → Z' },
  { id: 'name_desc', name: 'Name: Z → A' },
];

const availabilityOptions = [
  { id: 'in_stock', name: 'In stock' },
  { id: 'out_of_stock', name: 'Out of stock' },
];

const interiorPhotoOptions: { id: InteriorPhotoFilter; name: string }[] = [
  { id: 'with', name: 'With interior photo' },
  { id: 'without', name: 'Without interior photo' },
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [availability, setAvailability] = useState(ALL);
  const [interiorPhoto, setInteriorPhoto] = useState(ALL);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const pathname = usePathname();
  const router = useRouter();
  const language = pathname.split("/")[1];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(prev => (prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 }));
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const apiParams: ProductsSearchParams = {
    category,
    search: debouncedSearch,
    type: type === ALL ? '' : type,
    availability: availability === ALL ? '' : availability,
    interiorPhoto: interiorPhoto === ALL ? undefined : (interiorPhoto as InteriorPhotoFilter),
    language,
    sortBy,
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

  // Any filter change restarts from the first page
  const applyFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  const handleCategoryChange = applyFilter(setCategory);
  const handleTypeChange = applyFilter(setType);
  const handleAvailabilityChange = applyFilter(setAvailability);
  const handleInteriorPhotoChange = applyFilter(setInteriorPhoto);
  const handleSortChange = applyFilter(setSortBy);

  const handleAddProduct = () => {
    router.push(RouteConstants.ADD_PRODUCT_PAGE);
  };

  return (
    <div className="flex w-full flex-col h-full max-h-[calc(100vh-58px)] gap-2 overflow-hidden bg-transparent">
      <div className="flex flex-wrap items-center gap-2 m-2">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-[300px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-1 py-0 text-sm h-8 w-full"
          />
        </div>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="h-8 w-[calc(50%-4px)] sm:w-[140px] text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-8 w-[calc(50%-4px)] sm:w-[130px] text-sm">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {allowedTypes.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={availability} onValueChange={handleAvailabilityChange}>
          <SelectTrigger className="h-8 w-[calc(50%-4px)] sm:w-[130px] text-sm">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All stock</SelectItem>
            {availabilityOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={interiorPhoto} onValueChange={handleInteriorPhotoChange}>
          <SelectTrigger className="h-8 w-[calc(50%-4px)] sm:w-[190px] text-sm">
            <SelectValue placeholder="Interior photo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Interior: any</SelectItem>
            {interiorPhotoOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="h-8 w-[calc(50%-4px)] sm:w-[170px] text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleAddProduct}
          size="sm"
          className="flex items-center gap-1 h-8 bg-primary text-white hover:bg-primary/90 ms-auto"
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
