"use client";
import "./LangSwitcher.css"
import { memo, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Select from "@/shared/ui/Select/Select";

export const LangSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [currentLocale, setCurrentLocale] = useState(() => {
    const localeFromPath = pathname.split("/")[1];
    return ["en", "ru", "he"].includes(localeFromPath) ? localeFromPath : "en";
  });

  useEffect(() => {
    const localeFromPath = pathname.split("/")[1]; 
    if (["en", "ru", "he"].includes(localeFromPath)) {
      setCurrentLocale(localeFromPath); 
    }
  }, [pathname]);

  const onSelectChange = (newLocale: string) => {
    const path = pathname.split("/").slice(2).join("/"); 
    router.push(`/${newLocale}/${path}`);  
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Русский' },
    { value: 'he', label: 'עברית' }
  ];

  return (
      <Select
        className="select__arrow_white"
        options={languageOptions.map(lang => lang.label)}
        onChange={(selectedLabel) => {
          const selectedLocale = languageOptions.find(lang => lang.label === selectedLabel)?.value;
          if (selectedLocale) {
            onSelectChange(selectedLocale);
          }
        }}
        placeholder={languageOptions.find(lang => lang.value === currentLocale)?.label || 'Select Language'}
      />
  );
};

export default memo(LangSwitcher);