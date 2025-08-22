"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { getProductsQueryParams } from "@/Utils/paginationUtils";
import ProductSort from "../ProductSort/ProductSort";
import MobileFilterButton from "../MobileFilterButton/MobileFilterButton";
import ProductsLoadingGrid from "./_components/ProductsLoadingGrid";
import ProductCard from "../ProductCard/ProductCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { allCategoryProductsKey } from "@/constants/queryKey";
import { ProductsSearchParams, ProductsWithPagination } from "@/types/products";
import reactQueryFetchFunction from "@/Utils/reactQueryFetchFunction";
import productsServices from "@/services/productsServices";
import GlobalConstants from "@/constants/GlobalConstants";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProductsListProps {
  category: string;
}

export function allProductsByCategoryInfinite(
  params: Omit<ProductsSearchParams, 'page'>
) {
  return {
    queryKey: [allCategoryProductsKey, params],
    queryFn: ({ pageParam = 1 }) => reactQueryFetchFunction<ProductsWithPagination>(
      productsServices.getProductsByCategory,
      [],
      { ...params, page: pageParam },
    ),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.page < pagination.pages ? pagination.page + 1 : undefined;
    },
    staleTime: GlobalConstants.DROPDOWN_CACHE_TIME,
    initialPageParam: 1,
  };
}

const ProductsList = ({ category }: ProductsListProps) => {
  const { ref, inView, entry } = useInView();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const baseQueryParams = getProductsQueryParams(searchParams, pathname, category);
  const queryParams = {
    ...baseQueryParams,
    isRandom: category === "all" ? "true" : undefined
  };
   const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isPending
  } = useInfiniteQuery(allProductsByCategoryInfinite(queryParams));

  console.log("data", data)
  const allProducts = data?.pages.flatMap(page => page.data.products) || [];

  useEffect(() => {
    if(entry && inView){
      fetchNextPage()
    }
  }, [entry])
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 p-2">
        <ProductSort />
        <MobileFilterButton category={category}/>
      </div>
      
      {isPending ? (
        <ProductsLoadingGrid />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 px-2 min-h-screen">
            {allProducts.map((product)=> (
              <ProductCard
                key={product._id} 
                product={product}
                className="bg-transparent"
              />
            ))}
          </div>

          {isFetchingNextPage 
          ? <LoadingSpinner className="m-2"/>
          : <div ref={ref}/>}
        </>
      )}
    </div>
  );
};

export default ProductsList;