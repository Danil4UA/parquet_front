"use client";
import ProductCardSkeleton from "../../ProductCard/ProductCardSkeleton";

const ProductsLoadingGrid = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      {Array.from({ length: 20 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductsLoadingGrid;
