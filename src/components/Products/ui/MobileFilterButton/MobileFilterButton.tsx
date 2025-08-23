"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import "./MobileFilterButton.css";
import ProductsFilter from "../ProductsFilter/ProductsFilter";
import { Button } from "@/components/ui/button";
import { ListFilter, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface MobileFilterButtonProps {
  category: string;
}

const MobileFilterButton = ({
  category,
}: MobileFilterButtonProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const t = useTranslations("Filter");

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (!isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  const handleResetClick = () => {
    router.push(pathname);
    setIsFilterOpen(false);
  }

  return (
    <>
      <Button 
        className="sm:hidden h-8 md:h-10 border text-lg text-gray-800 hover:bg-gray-100"
        onClick={toggleFilter}
        variant="ghost"
      >
       <ListFilter className="h-5 w-5" />
        {t("Filters")}
      </Button>

      {isFilterOpen && (
        <div className="mobile-filter-overlay">
          <div className="mobile-filter-container">
            <div className="mobile-filter-header">
              <h3>{t("Filters")}</h3>
              <Button 
                variant="ghost"
                className="p-1 h-7 w-7"
                onClick={toggleFilter}
              >
                <X className="h-5 w-5 "/>
              </Button>
            </div>
            <div className="mobile-filter-content">
              <ProductsFilter 
                category={category}
              />
            </div>
            <div className="flex p-4 border-t gap-2">
              <Button 
                size="lg" 
                className="w-full font-bold" 
                onClick={toggleFilter}
              >
                {t("Apply")}
              </Button>
               <Button 
                size="lg" 
                variant="ghost" 
                className="font-bold border bg-white" 
                onClick={handleResetClick}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterButton;