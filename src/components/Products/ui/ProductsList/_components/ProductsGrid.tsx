"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addProducts } from "@/components/Products/model/productsSlice";
import { Product, ProductsSearchParams } from "@/types/products";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import productsServices from "@/services/productsServices";
import ProductCardSkeleton from "../../ProductCard/ProductCardSkeleton";

interface ProductsGridProps {
  products: Product[];
  queryParams: ProductsSearchParams;
}

const ProductsGrid = ({ products, queryParams }: ProductsGridProps) => {
  const prevQueryParamsRef = useRef<ProductsSearchParams>(queryParams);
  
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(queryParams.page || 1);
  const [hasMore, setHasMore] = useState(true);
  
  const dispatch = useDispatch();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const hasQueryParamsChanged = () => {
      const prev = prevQueryParamsRef.current;
      if (prev.page !== queryParams.page) return false;
      
      return prev.category !== queryParams.category ||
             prev.search !== queryParams.search ||
             prev.color !== queryParams.color ||
             prev.type !== queryParams.type ||
             prev.language !== queryParams.language ||
             prev.limit !== queryParams.limit;
    };
    
    if (hasQueryParamsChanged()) {
      setCurrentPage(queryParams.page || 1);
      setHasMore(true);
    }
    prevQueryParamsRef.current = queryParams;
  }, [queryParams]);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    
    try {
      const searchParams: ProductsSearchParams = {
        ...queryParams,
        page: nextPage
      };
      
      const data = await productsServices.getProductsByCategory(searchParams);
      if (data?.data.products && data?.data.products.length > 0) {
        dispatch(addProducts(data?.data.products));
        setCurrentPage(nextPage);
        setHasMore(nextPage < data?.data.pagination.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [queryParams, currentPage, dispatch, hasMore, isLoadingMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoadingMore && hasMore) {
        loadMoreProducts();
      }
    }, options);

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoadingMore, loadMoreProducts, hasMore]);

  useEffect(() => {
    if (lastProductRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(lastProductRef.current);
    }
  }, [products]);

  const setLastProductRef = (node: HTMLDivElement) => {
    lastProductRef.current = node;
    if (node && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(node);
    }
  };

  return (
    <>
      <div className="products__list">
        {products.map((product, index) => {
          const isLastProduct = index === products.length - 1;
          
          return (
            <div 
              key={product._id} 
              ref={isLastProduct ? setLastProductRef : null}
              className="product-item"
            >
              <ProductCard
                product={product ?? {}}
              />
            </div>
          );
        })}
      </div>
      
      {isLoadingMore && (
        <div className="products__list loading-more">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`more-${index}`} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductsGrid;