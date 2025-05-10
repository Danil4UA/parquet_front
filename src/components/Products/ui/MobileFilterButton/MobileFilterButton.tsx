"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import "./MobileFilterButton.css";
import ProductsFilter from "../ProductsFilter/ProductsFilter";

interface MobileFilterButtonProps {
  category: string;
}

const MobileFilterButton = ({
  category,
}: MobileFilterButtonProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const t = useTranslations("Filter");

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    if (!isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      <button className="mobile-filter-button" onClick={toggleFilter}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 2H1.5C1.224 2 1 1.776 1 1.5C1 1.224 1.224 1 1.5 1H14.5C14.776 1 15 1.224 15 1.5C15 1.776 14.776 2 14.5 2Z" fill="currentColor"/>
          <path d="M11.5 8.5H4.5C4.224 8.5 4 8.276 4 8C4 7.724 4.224 7.5 4.5 7.5H11.5C11.776 7.5 12 7.724 12 8C12 8.276 11.776 8.5 11.5 8.5Z" fill="currentColor"/>
          <path d="M8.5 15H7.5C7.224 15 7 14.776 7 14.5C7 14.224 7.224 14 7.5 14H8.5C8.776 14 9 14.224 9 14.5C9 14.776 8.776 15 8.5 15Z" fill="currentColor"/>
        </svg>
        <span className="mobile-filter-text">{t("Filters")}
        </span>
      </button>

      {isFilterOpen && (
        <div className="mobile-filter-overlay">
          <div className="mobile-filter-container">
            <div className="mobile-filter-header">
              <h3>{t("Filters")}</h3>
              <button className="close-filter-button" onClick={toggleFilter}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mobile-filter-content">
              <ProductsFilter 
                category={category}
              />
            </div>
            <div className="mobile-filter-footer">
              <button className="apply-filters-button" onClick={toggleFilter}>
                {t("Apply")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterButton;