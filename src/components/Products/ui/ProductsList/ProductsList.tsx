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
import { motion } from "framer-motion";

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
      {/* Топ панель */}
      <div className={cn(
        "flex items-center gap-2 p-2 fixed z-50 w-full h-[58px] transition-all duration-300",
        isMobile 
          ? "bg-gray-50 dark:bg-gray-900"
          // : "bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-b border-white/30 dark:border-gray-700/30",
          : "bg-gray-50 dark:bg-gray-900",
        getFilterPosition()
      )}>
        <ProductSort />
        <MobileFilterButton category={category}/>
      </div>
      
      {isPending ? (
        <ProductsLoadingGrid />
      ) : (
        <div className="pt-[58px]">
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 px-2 py-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {allProducts.map((product, index) => (
              <motion.div
                key={`${product._id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.02,
                  ease: "easeOut"
                }}
              >
                <ProductCard
                  product={product}
                  className={cn(
                    "transition-all duration-200",
                    isMobile 
                      ? "bg-transparent rounded-lg border-none"
                      : "bg-transparent rounded-xl border-none hover:shadow-md border"
                  )}
                />
              </motion.div>
            ))}
          </motion.div>

          {isFetchingNextPage ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner className="m-2"/>
            </div>
          ) : (
            <div ref={ref} className="h-4" />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsList;