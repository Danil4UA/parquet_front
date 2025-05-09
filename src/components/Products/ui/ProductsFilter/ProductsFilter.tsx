"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import "./ProductsFilter.css";
import { useTranslations } from "next-intl";

export interface Filters {
  color: string[];
  type: string[];
}

const ProductsFilter = () => {
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
  
  return (
    <div className="ProductsFilter">
      
      <div className="ProductsFilter_section">
        <h3 className="ProductsFilter_title">{t("Color")}</h3>
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

      <div className="ProductsFilter_section">
        <h3 className="ProductsFilter_title">{t("Type")}</h3>
        <div className="ProductsFilter_type">
          <label>
            <input
              type="checkbox"
              name="type"
              value="fishbone"
              onChange={handleFilterChange}
              checked={filters.type.includes("fishbone")}
            />
            {t("Fishbone")}
          </label>
          <label>
            <input 
              type="checkbox" 
              name="type" 
              value="plank" 
              onChange={handleFilterChange} 
              checked={filters.type.includes("plank")} 
            />
            {t("Plank")}
          </label>
          <label>
            <input 
              type="checkbox" 
              name="type" 
              value="cladding" 
              onChange={handleFilterChange} 
              checked={filters.type.includes("cladding")} 
            />
            {t("Cladding")}
          </label>
          <label>
            <input 
              type="checkbox" 
              name="type" 
              value="laminate" 
              onChange={handleFilterChange} 
              checked={filters.type.includes("laminate")} 
            />
            {t("Laminate")}
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductsFilter;