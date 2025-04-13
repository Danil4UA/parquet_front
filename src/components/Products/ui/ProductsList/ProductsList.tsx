"use client";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import "./ProductsList.css";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, addProducts } from "@/components/Products/model/productsSlice";
import { useEffect, useRef, useCallback } from "react";
import { RootState } from "@/redux/store";
import { filterProducts } from "@/components/Products/model/productsSlice";
import { useState } from "react";
import productsServices from "@/services/productsServices";
import { ProductsSearchParams } from "@/types/products";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
import ProductSort from "../ProductSort/ProductSort";
import { usePathname, useSearchParams } from "next/navigation";
import MobileFilterButton from "../MobileFilterButton/MobileFilterButton";

interface ProductsListProps {
  category: string;
}
const ProductsList = ({ category }: ProductsListProps) => {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(category ? false : true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const limit = 16;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  const search = searchParams.get("search") || "";
  const color = searchParams.get("color") || "";
  const type = searchParams.get("type") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const searchParams: ProductsSearchParams = {
          category,
          search,
          color,
          type,
          language,
          page,
          limit
        };
        
        const data = await productsServices.getProductsByCategory(searchParams);
        dispatch(setProducts(data.products || []));
        setHasMore(data.pagination.page < data.pagination.pages);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [category, search, color, type, dispatch, language]);

  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    
    try {
      const searchParams: ProductsSearchParams = {
        category,
        search,
        color,
        type,
        language,
        page: nextPage,
        limit
      };
      
      const data = await productsServices.getProductsByCategory(searchParams);
      if (data.products && data.products.length > 0) {
        dispatch(addProducts(data.products));
        setCurrentPage(nextPage);
        setHasMore(nextPage < data.pagination.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [category, search, color, type, currentPage, dispatch, hasMore, isLoadingMore, language]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && !isLoadingMore) {
        loadMoreProducts();
      }
    }, options);

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isLoading, isLoadingMore, loadMoreProducts]);

  const filters = useSelector((state: RootState) => state.products.filters);
  const productsList = useSelector((state: RootState) => state.products.filteredProducts);
  
  useEffect(() => {
    dispatch(filterProducts(filters));
  }, [filters, dispatch]);

  useEffect(() => {
    if (lastProductRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(lastProductRef.current);
    }
  }, [productsList]);

  const setLastProductRef = (node: HTMLDivElement) => {
    lastProductRef.current = node;
    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  };

  return (
    <div className="products__list_wrapper">
      <div className="products__list_header">
        <ProductSort />
        <MobileFilterButton />
      </div>
      <div className="products__list">
        {isLoading
          ? Array.from({ length: 16 }).map((_, index) => <ProductCardSkeleton key={index} />)
          : productsList.map((product, index) => {
              const isLastProduct = index === productsList.length - 1;
              
              return (
                <div 
                  key={product._id} 
                  ref={isLastProduct ? setLastProductRef : null}
                >
                  <ProductCard
                    productId={product._id}
                    productName={product.name}
                    productPrice={product.price}
                    discount={product.discount}
                    images={product.images}
                    stock={product.stock}
                    category={product.category}
                    finish={product.finish}
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
      {!isLoading && !isLoadingMore && productsList.length === 0 && (
        <div className="no-products-message">
          {search ? 
            `No products found matching "${search}"` : 
            "No products found matching the selected filters."}
        </div>
      )}
    </div>
  );
};

export default ProductsList;