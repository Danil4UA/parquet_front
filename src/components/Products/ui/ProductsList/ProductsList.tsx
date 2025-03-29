"use client";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import "./ProductsList.css";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, addProducts } from "@/components/Products/model/productsSlice";
import { useEffect, useRef, useCallback } from "react";
import { RootState } from "@/redux/store";
import { filterProducts } from "@/components/Products/model/productsSlice";
import { useState } from "react";
import productsServices from "@/services/prodcuts.services";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";
import ProductSort from "../ProductSort/ProductSort";
import { usePathname } from "next/navigation";

export interface Product {
  _id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: string;
  images: string[];
  category: string;
  stock: number;
  discount: number;
  isAvailable: boolean;
  color: string;
  type: string;
  material: string;
  countryOfOrigin: string;
  width?: string;
  length?: string;
  company?: string;
  thickness?: string
  model: string
  finish: string
}
interface ProductsListProps {
  category: string;
}
const ProductsList = ({ category }: ProductsListProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const limit = 16;
  const dispatch = useDispatch();
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);

  // Initial load of products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productsServices.getProductsByCategory(category, language, 1, limit);
        dispatch(setProducts(data.products || []));
        setTotalPages(data.pagination.pages);
        setHasMore(data.pagination.page < data.pagination.pages);
        setCurrentPage(1);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category, dispatch, language]);

  // Load more products when scrolling to bottom
  const loadMoreProducts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);
    
    try {
      const data = await productsServices.getProductsByCategory(category, language, nextPage, limit);
      if (data.products && data.products.length > 0) {
        dispatch(addProducts(data.products));
        setCurrentPage(nextPage);
        setHasMore(nextPage < data.pagination.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [category, currentPage, dispatch, hasMore, isLoadingMore, language]);

  // Setup intersection observer for infinite scroll
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

  // Update the observer when the list changes
  useEffect(() => {
    if (lastProductRef.current && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(lastProductRef.current);
    }
  }, [productsList]);

  // Callback ref for the last product element
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
      </div>
      <div className="products__list">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)
          : productsList.map((product, index) => {
              // Check if this is the last item
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
                    category={category}
                    finish={product.finish}
                  />
                </div>
              );
            })}
      </div>
      {isLoadingMore && (
        <div className="products__loading_more">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={`more-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;