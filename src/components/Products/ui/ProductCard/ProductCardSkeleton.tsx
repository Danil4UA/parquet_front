import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProductCard.css";

const ProductCardSkeleton = () => {
  return (
    <div className="ProductCard">
      <div className="card__image">
        <Skeleton height={300} width={300} />
      </div>
      <div className="card__information">
        <Skeleton height={20} width={200}  />
        <Skeleton height={20} width={150} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
