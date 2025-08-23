"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { getProductsQueryParams } from "@/Utils/paginationUtils";
import ProductSort from "../ProductSort/ProductSort";
import MobileFilterButton from "../MobileFilterButton/MobileFilterButton";
import ProductsLoadingGrid from "./_components/ProductsLoadingGrid";
import ProductCard from "../ProductCard/ProductCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { allProductsByCategoryInfinite } from "@/constants/queryInfo";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { selectNavbarVisible } from "@/components/Navbar/model/navbarSlice";
import { cn } from "@/lib/utils";

interface ProductsListProps {
  category: string;
}
const ProductsList = ({ category }: ProductsListProps) => {
  const { ref, inView, entry } = useInView();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isNavbarVisible = useSelector((state: RootState) => selectNavbarVisible(state));
  const { isMobile } = useIsMobileDebounce();

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

  const allProducts = data?.pages.flatMap(page => page.data.products) || [];

  useEffect(() => {
    if(entry && inView){
      fetchNextPage()
    }
  }, [entry])

     const getFilterPosition = () => {
    if (!isMobile) {
      return "top-[var(--navbar-height)]";
    }
    return isNavbarVisible ? "top-[var(--navbar-height)]" : "top-0";
  };

  return (
    <div className="relative w-full">
      <div className={cn(
        "flex items-center gap-2 p-2 fixed z-50 bg-white w-full h-[58px] items-center transition-all duration-300",
        getFilterPosition()
      )}>
        <ProductSort />
        <MobileFilterButton category={category}/>
      </div>
      
      {isPending ? (
        <ProductsLoadingGrid />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 px-2 pt-[58px]">
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