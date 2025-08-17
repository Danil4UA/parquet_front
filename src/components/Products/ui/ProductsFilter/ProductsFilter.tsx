"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import "./ProductsFilter.css";
import { useTranslations } from "next-intl";
interface CategoryConfig {
  showColorFilter: boolean;
  showTypeFilter: boolean;
  excludeTypes: string[];
}
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
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
    const updatedFilters: Filters = { ...filters };
    
    if (type === "checkbox") {
      const newFilters = [...updatedFilters[name as keyof Filters]];
      if (checked) {
        if (!newFilters.includes(value)) {
          newFilters.push(value);
        }
      } else {
        const index = newFilters.indexOf(value);
        if (index > -1) {
          newFilters.splice(index, 1);
        }
      }
      
      updatedFilters[name as keyof Filters] = newFilters;
    } else if (type === "radio" || type === "select-one") {
      updatedFilters[name as keyof Filters] = [value];
    }
    
    setFilters(updatedFilters);
    updateUrlParams(updatedFilters);
  };
  
  const categoryConfig: Record<string, CategoryConfig> = {
    all: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: []
    },
    cladding: {
      showColorFilter: true,
      showTypeFilter: false,
      excludeTypes: []
    },
    laminate: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: ["laminate", "cladding"]
    },
    wood: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: ["cladding", "laminate"]
    },
    spc: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: ["cladding", "laminate"]
    },
    default: {
      showColorFilter: true,
      showTypeFilter: true,
      excludeTypes: []
    }
  };
  
  const currentConfig = categoryConfig[
    category.toLowerCase() as keyof typeof categoryConfig
  ] || categoryConfig.default;
  
  const allTypeOptions: TypeOption[] = [
    { value: "fishbone", label: t("Fishbone") },
    { value: "plank", label: t("Plank") },
    { value: "cladding", label: t("Cladding") },
    // { value: "laminate", label: t("Laminate") }
  ];
  
  const typeOptions = allTypeOptions.filter(option => 
    !currentConfig.excludeTypes.includes(option.value)
  );
  
  return (
<div className="md:w-[222px] p-2">
      {currentConfig.showColorFilter && (
        <div className="ProductsFilter_section">
          <h3 className="py-3">{t("Color")}</h3>
          <div className="ProductsFilter_color">
            <label className="color-checkbox">
              <input 
                type="checkbox" 
                name="color" 
                value="beige" 
                onChange={handleFilterChange} 
                checked={filters.color.includes("beige")} 
              />
              <span className="color-square" style={{ backgroundColor: "#F5F5DC" }}></span>
            </label>
            <label className="color-checkbox">
              <input 
                type="checkbox" 
                name="color" 
                value="gray" 
                onChange={handleFilterChange} 
                checked={filters.color.includes("gray")} 
              />
              <span className="color-square" style={{ backgroundColor: "#808080" }}></span>
            </label>
            <label className="color-checkbox">
              <input 
                type="checkbox" 
                name="color" 
                value="brown" 
                onChange={handleFilterChange} 
                checked={filters.color.includes("brown")} 
              />
              <span className="color-square" style={{ backgroundColor: "#8B4513" }}></span>
            </label>
            <label className="color-checkbox">
              <input 
                type="checkbox" 
                name="color" 
                value="smoke" 
                onChange={handleFilterChange} 
                checked={filters.color.includes("smoke")} 
              />
              <span className="color-square" style={{ backgroundColor: "#f2f2f2" }}></span>
            </label>
            <label className="color-checkbox">
              <input 
                type="checkbox" 
                name="color" 
                value="dark" 
                onChange={handleFilterChange} 
                checked={filters.color.includes("dark")} 
              />
              <span className="color-square" style={{ backgroundColor: "#333333" }}></span>
            </label>
          </div>
        </div>
      )}

      {currentConfig.showTypeFilter && (
        <div className="ProductsFilter_section">
          <h3 className="ProductsFilter_title">{t("Type")}</h3>
          <div className="ProductsFilter_type">
            {typeOptions.map(option => (
              <label key={option.value}>
                <input
                  type="checkbox"
                  name="type"
                  value={option.value}
                  onChange={handleFilterChange}
                  checked={filters.type.includes(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsFilter;