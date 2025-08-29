"use client";

import { selectNavbarVisible } from "@/components/Navbar/model/navbarSlice";
import ProductsFilter from "@/components/Products/ui/ProductsFilter/ProductsFilter";
import ProductsList from "@/components/Products/ui/ProductsList/ProductsList";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { useParams, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const pathname = usePathname();
  const isNavbarVisible = useSelector((state: RootState) => selectNavbarVisible(state));
  const { isMobile } = useIsMobileDebounce();

  const isHebrew = pathname.split("/")[1] === "he";

   const getFilterPosition = () => {
    if (!isMobile) {
      return "top-[var(--navbar-height)]";
    }
    return isNavbarVisible ? "top-[var(--navbar-height)]" : "top-0";
  };

  return (
    <>
      <div className="flex flex-col items-center w-full bg-gray-50">
        <div className="flex w-full">
          <div className={cn(
            "hidden md:block fixed z-50 transition-all duration-300",
            isHebrew ? "right-0" : "left-0",
            getFilterPosition(),
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
