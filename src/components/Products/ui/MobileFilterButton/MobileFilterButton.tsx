"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import "./MobileFilterButton.css";
import ProductsFilter from "../ProductsFilter/ProductsFilter";
import { Button } from "@/components/ui/button";
import { ListFilter, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button 
          className={cn(
            "sm:hidden h-8 md:h-10 border text-sm transition-all duration-200",
            "bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white/90"
          )}
          onClick={toggleFilter}
          variant="ghost"
        >
          <ListFilter className="h-4 w-4 mr-2" />
          {t("Filters")}
        </Button>
      </motion.div>

      {isFilterOpen && (
        <motion.div 
          className="mobile-filter-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleFilter}
        >
          <motion.div 
            className="mobile-filter-container"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-filter-header">
              <h3>{t("Filters")}</h3>
              <Button 
                variant="ghost"
                className="p-1 h-7 w-7"
                onClick={toggleFilter}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mobile-filter-content">
              <ProductsFilter 
                category={category}
              />
            </div>
            <motion.div 
              className="flex p-4 border-t gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
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
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default MobileFilterButton;