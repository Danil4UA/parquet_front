"use client";
import ProductsFilter from "@/components/Products/ui/ProductsFilter/ProductsFilter";
import ProductsList from "@/components/Products/ui/ProductsList/ProductsList";
import { useParams } from "next/navigation";
import "./products.css";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <>
      <div className="CategoryPage">
        <div className="products-page-container">
          <ProductsFilter category={category}/>
          <ProductsList category={category} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
