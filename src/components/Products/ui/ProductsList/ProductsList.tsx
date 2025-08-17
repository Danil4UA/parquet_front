"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";
import { RootState } from "@/redux/store";
import { setProducts } from "@/components/Products/model/productsSlice";
import { getProductsQueryParams } from "@/Utils/paginationUtils";
import ProductSort from "../ProductSort/ProductSort";
import MobileFilterButton from "../MobileFilterButton/MobileFilterButton";
import ProductsGrid from "./_components/ProductsGrid";
import ProductsLoadingGrid from "./_components/ProductsLoadingGrid";
import useGetAllProductsByCategory from "@/hooks/useGetAllProductsByCategory";
import "./ProductsList.css";

interface ProductsListProps {
  category: string;
}

const ProductsList = ({ category }: ProductsListProps) => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const baseQueryParams = getProductsQueryParams(searchParams, pathname, category);
  const queryParams = {
    ...baseQueryParams,
    isRandom: category === "all" ? "true" : undefined
  };
  const { data, isPending, isSuccess } = useGetAllProductsByCategory(queryParams);

  const productsList = useSelector((state: RootState) => state.products.filteredProducts);

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(setProducts(data.data.products));
    }
  }, [data, isSuccess, dispatch]);


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
          <ProductsGrid 
            products={productsList} 
            queryParams={queryParams}
          />
        </>
      )}
    </div>
  );
};

export default ProductsList;