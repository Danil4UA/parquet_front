"use client";
import "./LangSwitcher.css";
import { memo, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Select from "@/shared/ui/Select/Select";
import { languageOptions, getLocaleFromPath } from "@/Utils/languageUtils";

export const LangSwitcher = () => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  const [currentLocale, setCurrentLocale] = useState(() => 
    getLocaleFromPath(pathname)
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const localeFromPath = getLocaleFromPath(pathname);
    setCurrentLocale(localeFromPath);
  }, [pathname]);

  const onSelectChange = (newLocale: string) => {
    const path = pathname.split("/").slice(2).join("/");
    window.location.href = `/${newLocale}/${path}`;
  };

  const currentLanguage = languageOptions.find(lang => lang.value === currentLocale);
  
  return (
    <Select
      className="select__arrow_white"
      options={languageOptions.map(lang => isMobile ? lang.abbr : lang.label)}
      onChange={(selected) => {
        const selectedOption = languageOptions.find(
          lang => (isMobile ? lang.abbr : lang.label) === selected
        );
        
        if (selectedOption) {
          onSelectChange(selectedOption.value);
        }
      }}
      placeholder={isMobile 
        ? currentLanguage?.abbr || "EN" 
        : currentLanguage?.label || "English"}
    />
  );
};

export default memo(LangSwitcher);