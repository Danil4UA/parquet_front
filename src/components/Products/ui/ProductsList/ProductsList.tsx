"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { getProductsQueryParams } from "@/Utils/paginationUtils";
import ProductsLoadingGrid from "./_components/ProductsLoadingGrid";
import NoProductsMessage from "./_components/NoProductsMessage";
import ProductCard from "../ProductCard/ProductCard";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
import { allProductsByCategoryInfinite } from "@/constants/queryInfo";
import { pushEcommerceEvent } from "@/Utils/googleUtils";

interface ProductsListProps {
  category: string;
}

const ProductsList = ({ category }: ProductsListProps) => {
  // The sentinel counts as visible 1200px before it is reached, so the next page is usually there before the visitor gets to the end.
  const { ref, inView, entry } = useInView({ rootMargin: "1200px 0px" });
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Order is decided by the backend: products with an interior photo first,
  // then a daily shuffle (unless the user picks an explicit sort).
  const queryParams = getProductsQueryParams(searchParams, pathname, category);
  const sentViewItemListRef = useRef(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending
  } = useInfiniteQuery(allProductsByCategoryInfinite(queryParams));

  const allProducts = data?.pages.flatMap(page => page.data.products) || [];

  useEffect(() => {
    if (entry && inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [entry])

  useEffect(() => {
    if (sentViewItemListRef.current) return;
    if (!data?.pages?.length) return;
    if (isPending) return;

    if (!isPending && data.pages.length > 0) {
      const firstPageProducts = data.pages[0].data.products;

      const itemsForEcommerce = firstPageProducts.map((product, index) => ({
        item_id: product._id,
        item_name: product.name,
        price: Number(product.price),
        item_category: product.category,
        index: index + 1
      }));

      if (firstPageProducts.length > 0) {
          pushEcommerceEvent("view_item_list", {
            item_list_id: category,
            item_list_name: category,
            items: itemsForEcommerce
          });

          sentViewItemListRef.current = true;
      }
    }
  }, [isPending, data, category]);


  // Two columns on phones; wider screens fit as many ~220px+ cards as the row allows (up to 5-6 on large monitors).
  const gridClass = "grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:gap-x-4";

  return (
    // A full screen of height is reserved, so the footer and the sticky filter column do not jump while a list loads.
    <div className="min-h-[100dvh] min-w-0">
      {isPending ? (
        <ProductsLoadingGrid className={gridClass} />
      ) : allProducts.length === 0 ? (
        <NoProductsMessage />
      ) : (
        <>
          <div className={gridClass}>
            {allProducts.map((product, index) => (
              <ProductCard key={`${product._id}-${index}`} product={product} priority={index < 4} className="rounded-xl border-none bg-transparent" />
            ))}
            {/* While the next page loads, placeholder cards continue the grid: same size as real cards, nothing shifts. */}
            {isFetchingNextPage && Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={`next-${index}`} />)}
          </div>
          <div ref={ref} className="h-4" />
        </>
      )}
    </div>
  );
};

export default ProductsList;
