"use client";

import ProductsFilter from "@/components/Products/ui/ProductsFilter/ProductsFilter";
import ProductsList from "@/components/Products/ui/ProductsList/ProductsList";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const pathname = usePathname();
  const isHebrew = pathname.split("/")[1] === "he";

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex w-full">
          <div className={cn(
            "hidden md:block fixed top-18 z-50",
            isHebrew ? "right-0" : "left-0",
          )}>
            <ProductsFilter category={category}/>
          </div>
          <div className={cn(
            "w-full",
             isHebrew ? "md:mr-[250px]" : "md:ml-[250px]",
          )}>
            <ProductsList category={category} />
          </div>        
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
