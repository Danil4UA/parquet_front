"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { setProducts, filterProducts } from "@/components/Products/model/productsSlice";
import { getProductsQueryParams } from "@/Utils/paginationUtils";
import ProductSort from "../ProductSort/ProductSort";
import MobileFilterButton from "../MobileFilterButton/MobileFilterButton";
import ProductsGrid from "./_components/ProductsGrid";
import ProductsLoadingGrid from "./_components/ProductsLoadingGrid";
import NoProductsMessage from "./_components/NoProductsMessage";
import useGetAllProductsByCategory from "@/hooks/useGetAllProductsByCategory";
import "./ProductsList.css";

interface ProductsListProps {
  category: string;
}

const ProductsList = ({ category }: ProductsListProps) => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const pathname = usePathname();
  
  const queryParams = getProductsQueryParams(searchParams, pathname, category);
  const { search } = queryParams;

  const { data, isPending, isSuccess } = useGetAllProductsByCategory(queryParams);

  const filters = useSelector((state: RootState) => state.products.filters);
  const productsList = useSelector((state: RootState) => state.products.filteredProducts);

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setProducts(data.data.products));
    }
  }, [data, isSuccess, dispatch]);

  useEffect(() => {
    dispatch(filterProducts(filters));
  }, [filters, dispatch]);

  return (
    <div className="products__list_wrapper">
      <div className="products__list_header">
        <ProductSort />
        <MobileFilterButton />
      </div>
      
      {isPending ? (
        <ProductsLoadingGrid />
      ) : (
        <>
          <ProductsGrid 
            products={productsList} 
            queryParams={queryParams}
          />
          
          {productsList.length === 0 && (
            <NoProductsMessage search={search} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductsList;