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
    <Card className="sm:max-w-[250px] w-full shadow-none border-none border-r">
      <CardContent className="p-0">
        {currentConfig.showColorFilter && (
          <div>
            {/* <h3 className="font-medium text-sm">{t("Color")}</h3> */}
            <div className="flex flex-wrap gap-2 min-h-[58px] py-2 items-center px-2">
              {colorOptions.map((color) => (
                <div key={color.value} className="flex items-center space-x-1">
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
                      className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                        filters.color.includes(color.value)
                          ? 'border-primary shadow-md ring-2 ring-primary/20'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.label}
                    />
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentConfig.showColorFilter && currentConfig.showTypeFilter && (
          <Separator />
        )}

        {currentConfig.showTypeFilter && (
          <div className="p-3 space-y-2">
            <h3 className="font-medium text-sm">{t("Type")}</h3>
            <div className="">
              {typeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${option.value}`}
                    checked={filters.type.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleTypeChange(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`type-${option.value}`}
                    className="font-normal cursor-pointer px-2 text-md"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductsFilter;