"use client";
import ProductsFilter from "@/components/Products/ui/ProductsFilter/ProductsFilter";
import ProductsList from "@/components/Products/ui/ProductsList/ProductsList";
import { useParams } from "next/navigation";
import "./products.css";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex w-full">
          <div className="hidden md:block">
            <ProductsFilter category={category}/>
          </div>
          <ProductsList category={category} />
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
