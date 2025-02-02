"use client"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "@/components/Products/model/productsSlice";

const ProductFilterLoader = () => {
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const productFilters = localStorage.getItem("productFilters");
        if (productFilters) {
          const filters = JSON.parse(productFilters);
          dispatch(setFilters(filters));
        }
      }
    }, [dispatch]);
    return null;
  };

export default ProductFilterLoader;