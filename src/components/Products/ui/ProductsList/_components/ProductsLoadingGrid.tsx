"use client";
import ProductCardSkeleton from "../../ProductCard/ProductCardSkeleton";

const ProductsLoadingGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 p-4 sm:p-6 lg:p-8 pt-2 sm:pt-4 min-h-screen">
      {Array.from({ length: 16 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductsLoadingGrid;