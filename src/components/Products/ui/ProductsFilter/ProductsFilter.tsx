"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import "./ProductsFilter.css";
import { useTranslations } from "next-intl";
import Utils from "@/Utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

interface TypeOption {
  value: string;
  label: string;
}

export interface Filters {
  color: string[];
  type: string[];
}

interface ProductsFilterProps {
  category: string;
}

const categoryConfig = Utils.filterCategoryConfig;

const ProductsFilter = ({ category }: ProductsFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Filter");
  const { isMobile } = useIsMobileDebounce();
  
  const getFiltersFromUrl = () => {
    const filters: Filters = {
      color: [],
      type: [],
    };
    
    Object.keys(filters).forEach(key => {
      const param = searchParams.get(key);
      if (param) {
        filters[key as keyof Filters] = param.split(',');
      }
    });
    
    return filters;
  };
  
  const [filters, setFilters] = useState<Filters>(getFiltersFromUrl());
  
  const updateUrlParams = (newFilters: Filters) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
    });
    
    router.push(`${pathname}?${params.toString()}`);
  };
  
  useEffect(() => {
    setFilters(getFiltersFromUrl());
  }, [searchParams]);

  const handleColorChange = (colorValue: string, checked: boolean) => {
    const updatedFilters = { ...filters };
    const newColors = [...updatedFilters.color];
    
    if (checked) {
      if (!newColors.includes(colorValue)) {
        newColors.push(colorValue);
      }
    } else {
      const index = newColors.indexOf(colorValue);
      if (index > -1) {
        newColors.splice(index, 1);
      }
    }
    
    updatedFilters.color = newColors;
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };

  const handleTypeChange = (typeValue: string, checked: boolean) => {
    const updatedFilters = { ...filters };
    const newTypes = [...updatedFilters.type];
    
    if (checked) {
      if (!newTypes.includes(typeValue)) {
        newTypes.push(typeValue);
      }
    } else {
      const index = newTypes.indexOf(typeValue);
      if (index > -1) {
        newTypes.splice(index, 1);
      }
    }
    
    updatedFilters.type = newTypes;
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };
  
  const currentConfig = categoryConfig[
    category.toLowerCase() as keyof typeof categoryConfig
  ] || categoryConfig.default;
  
  const allTypeOptions: TypeOption[] = [
    { value: "fishbone", label: t("Fishbone") },
    { value: "plank", label: t("Plank") },
    { value: "cladding", label: t("Cladding") },
  ];
  
  const typeOptions = allTypeOptions.filter(option => 
    !currentConfig.excludeTypes.includes(option.value)
  );

  const colorOptions = [
    { value: "beige", color: "#F5F5DC", label: "Beige" },
    { value: "gray", color: "#808080", label: "Gray" },
    { value: "brown", color: "#8B4513", label: "Brown" },
    { value: "smoke", color: "#f2f2f2", label: "Smoke" },
    { value: "dark", color: "#333333", label: "Dark" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        "sm:max-w-[250px] w-full shadow-none border-none border-r relative overflow-hidden",
        isMobile 
          ? "bg-white dark:bg-gray-800"
          : "bg-white/20 dark:bg-gray-900/20 backdrop-blur-md border-r border-white/30 dark:border-gray-700/30"
      )}>
        <CardContent className="p-0 relative z-10">
          {currentConfig.showColorFilter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-3 min-h-[70px] py-4 items-center px-4">
                {colorOptions.map((color, index) => (
                  <motion.div 
                    key={color.value} 
                    className="flex items-center space-x-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                  >
                    <Checkbox
                      id={`color-${color.value}`}
                      checked={filters.color.includes(color.value)}
                      onCheckedChange={(checked) => 
                        handleColorChange(color.value, checked as boolean)
                      }
                      className="sr-only"
                    />
                    <Label
                      htmlFor={`color-${color.value}`}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                          filters.color.includes(color.value)
                            ? 'border-primary shadow-md ring-2 ring-primary/30'
                            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                        )}
                        style={{ backgroundColor: color.color }}
                        title={color.label}
                      />
                    </Label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentConfig.showColorFilter && currentConfig.showTypeFilter && (
            <Separator className="opacity-20" />
          )}

          {currentConfig.showTypeFilter && (
            <motion.div 
              className="p-4 space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {t("Type")}
              </h3>
              
              <div className="space-y-2">
                {typeOptions.map((option, index) => (
                  <motion.div 
                    key={option.value} 
                    className="flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-gray-100/50 dark:hover:bg-gray-700/30"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.4 + index * 0.1 }}
                  >
                    <Checkbox
                      id={`type-${option.value}`}
                      checked={filters.type.includes(option.value)}
                      onCheckedChange={(checked) => 
                        handleTypeChange(option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`type-${option.value}`}
                      className="font-normal cursor-pointer text-sm text-gray-700 dark:text-gray-300 px-2"
                    >
                      {option.label}
                    </Label>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductsFilter;