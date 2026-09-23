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
import { ChevronDown, Globe } from "lucide-react";

interface LangSwitcherProps {
  /** "dark" renders dark text for light surfaces (e.g. inside the sidebar). */
  tone?: "light" | "dark";
  /** Icon-only trigger (globe + current code) for narrow bars. */
  compact?: boolean;
}

export const LangSwitcher = ({ tone = "light", compact = false }: LangSwitcherProps) => {
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
        <button
          aria-label={currentLanguage?.label}
          className={
            compact
              ? tone === "dark"
                ? "flex size-9 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#F5F5F4] outline-none sm:size-10"
                : "flex h-11 items-center gap-1 rounded-lg px-2 text-white transition-colors hover:bg-white/10 outline-none"
              : tone === "dark"
                ? "flex h-10 items-center gap-1 rounded-lg px-2 text-sm font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4] outline-none"
                : "flex h-10 items-center gap-1 text-sm font-medium text-white transition-colors hover:text-white/80 outline-none"
          }
        >
          {compact ? (
            <Globe className="size-5 sm:size-[22px]" strokeWidth={1.75} />
          ) : (
            <>
              <span>{isMobile ? currentLanguage?.abbr : currentLanguage?.label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={currentLocale === "he" ? "end" : "start"} className="z-[200]">
        {languageOptions.map(lang => (
          <DropdownMenuItem
            key={lang.value}
            onClick={() => onSelectChange(lang.value)}
            className={`${currentLocale === lang.value ? "font-semibold" : ""} ${currentLocale === "he" ? "text-right justify-end" : ""}`}
          >
            {isMobile ? lang.abbr : lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(LangSwitcher);
