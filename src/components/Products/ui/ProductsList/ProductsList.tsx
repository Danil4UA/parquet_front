"use client";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import "./ProductsList.css";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/components/Products/model/productsSlice";
import { useEffect } from "react";
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
  const dispatch = useDispatch();
  const pathname = usePathname();
  const language = pathname.split("/")[1];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productsServices.getProductsByCategory(category, language);
        dispatch(setProducts(products || []));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [category, dispatch, language]);


  const filters = useSelector((state: RootState) => state.products.filters);
  const productsList = useSelector((state: RootState) => state.products.filteredProducts);
  useEffect(() => {
    dispatch(filterProducts(filters));
  }, [filters, dispatch]);

  return (
    <div className="products__list_wrapper">
      <div className="products__list_header">
        <ProductSort />
      </div>
      <div className="products__list">
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => <ProductCardSkeleton key={index} />)
          : productsList.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                productName={product.name}
                productPrice={product.price}
                discount={product.discount}
                images={product.images}
                stock={product.stock}
                category={category}
                finish={product.finish}
              />
            ))}
      </div>
    </div>
  );
};

export default ProductsList;
