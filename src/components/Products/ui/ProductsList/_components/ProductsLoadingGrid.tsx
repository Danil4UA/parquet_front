"use client";
import ProductCardSkeleton from "../../ProductCard/ProductCardSkeleton";

const ProductsLoadingGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 px-2 min-h-screen">
      {Array.from({ length: 16 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductsLoadingGrid;