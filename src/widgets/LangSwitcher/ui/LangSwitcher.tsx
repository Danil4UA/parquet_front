"use client";

import { memo, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { languageOptions, getLocaleFromPath } from "@/Utils/languageUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export const LangSwitcher = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  const [currentLocale, setCurrentLocale] = useState(() =>
    getLocaleFromPath(pathname)
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setCurrentLocale(getLocaleFromPath(pathname));
  }, [pathname]);

  const onSelectChange = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    const pathWithoutLocale = languageOptions.some(l => l.value === segments[0])
      ? segments.slice(1)
      : segments;
    const newPath = `/${newLocale}/${pathWithoutLocale.join("/")}`;
    const params = searchParams.toString();
    window.location.href = params ? `${newPath}?${params}` : newPath;
  };

  const currentLanguage = languageOptions.find(lang => lang.value === currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 text-white text-sm font-medium hover:text-white/80 transition-colors outline-none">
          <span>{isMobile ? currentLanguage?.abbr : currentLanguage?.label}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-[200]">
        {languageOptions.map(lang => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => onSelectChange(lang.value)}
            className={currentLocale === lang.value ? "font-semibold" : ""}
          >
            {isMobile ? lang.abbr : lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(LangSwitcher);
