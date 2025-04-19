"use client";
import ProductCardSkeleton from "../../ProductCard/ProductCardSkeleton";

const ProductsLoadingGrid = () => {
  return (
    <div className="products__list">
      {Array.from({ length: 16 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductsLoadingGrid;