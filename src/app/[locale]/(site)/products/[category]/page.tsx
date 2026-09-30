"use client";

import ProductsFilter, { useProductFilters } from "@/components/Products/ui/ProductsFilter/ProductsFilter";
import MobileFilterButton from "@/components/Products/ui/MobileFilterButton/MobileFilterButton";
import ProductsList from "@/components/Products/ui/ProductsList/ProductsList";
import ProductSort from "@/components/Products/ui/ProductSort/ProductSort";
import { SidebarItemsList } from "@/components/Sidebar/model/items";
import useSalesAvailable from "@/hooks/useSalesAvailable";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import Utils from "@/Utils/utils";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { CSSProperties, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectNavbarVisible } from "@/components/Navbar/model/navbarSlice";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";
import { RootState } from "@/redux/store";

// Category slug → its name in the navigation strings.
const CATEGORY_TITLES: Record<string, string> = {
  all: "catalog",
  wood: "wood",
  laminate: "laminate",
  spc: "spc",
  sales: "sales",
  panels: "panels",
  thresholds: "thresholds",
  cladding: "cladding",
  cleaning: "cleaningProducts",
};

/**
 * Smoothly scrolls to the top while the category page is swapped. The old list unmounts before the new one
 * renders; without the temporary min-height the page would collapse for a moment and the scroll would snap to 0.
 */
const glideToTop = () => {
  if (window.scrollY === 0) return;
  document.body.style.minHeight = `${document.documentElement.scrollHeight}px`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.setTimeout(() => {
    document.body.style.minHeight = "";
  }, 1000);
};

// Scroll position of the chip row, kept between category pages (null until the catalog is first opened).
let lastChipsScroll: number | null = null;

const CATEGORY_LINKS = SidebarItemsList.filter((item) => item.path.startsWith("/products/"));

/** Catalog: category chips, filter column on desktop (a bottom sheet on phones), then the product grid. */
const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const t = useTranslations("Sidebar");
  const tFilter = useTranslations("Filter");
  const { activeCount, clear } = useProductFilters();

  const hasFilters = Utils.categoryHasFilters(category);

  // Where the sticky rows stop: under the navbar, or at the very top once the navbar has slid away on phones.
  const isNavbarVisible = useSelector((state: RootState) => selectNavbarVisible(state));
  const { isMobile } = useIsMobileDebounce();
  const stickyTop = { "--catalog-top": isMobile && !isNavbarVisible ? "0px" : "var(--navbar-height)" } as CSSProperties;

  const currentPath = `/products/${category?.toLowerCase()}`;

  const lng = usePathname().split("/")[1];
  const { salesAvailable } = useSalesAvailable(lng);
  const categoryLinks = CATEGORY_LINKS.filter((item) => salesAvailable || item.path !== "/products/sales");

  // Keep the current category's chip centred in the row. The page remounts on every category change, so the row's
  // previous scroll position is restored first and the row then glides to the new chip instead of jumping.
  const chipsRef = useRef<HTMLElement>(null);
  const activeChipRef = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const row = chipsRef.current;
    const chip = activeChipRef.current;
    if (!row || !chip) return;

    const isFirstVisit = lastChipsScroll === null;
    if (lastChipsScroll !== null) row.scrollLeft = lastChipsScroll;

    const rowBox = row.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    const offset = chipBox.left + chipBox.width / 2 - (rowBox.left + rowBox.width / 2);
    row.scrollBy({ left: offset, behavior: isFirstVisit ? "auto" : "smooth" });

    const remember = () => {
      lastChipsScroll = row.scrollLeft;
    };
    remember();
    row.addEventListener("scroll", remember, { passive: true });
    return () => row.removeEventListener("scroll", remember);
  }, [category]);

  return (
    <div className="w-full bg-white">
      {/* Wider than the rest of the site: on large monitors the grid shows more products per row. */}
      <div className="mx-auto max-w-[1600px] px-4 pb-11 sm:px-7 sm:pb-[72px]" style={stickyTop}>
        {/* The active chip already names the category; the heading stays for screen readers and search engines. */}
        <h1 className="sr-only">
          {t(CATEGORY_TITLES[category?.toLowerCase()] ?? "catalog")}
        </h1>

        {/* Sticky row, 64px tall (12 + 40 + 12): category chips that scroll sideways, then filters and sort. The filter column sticks right below it. */}
        <div className="sticky top-[var(--catalog-top)] z-[41] -mx-4 flex items-center gap-2 bg-white px-4 py-3 transition-[top] duration-300 sm:-mx-7 sm:px-7">
          <nav ref={chipsRef} aria-label={t("catalog")} className="-ms-4 min-w-0 flex-1 overflow-x-auto ps-4 [scrollbar-width:none] sm:-ms-7 sm:ps-7 [&::-webkit-scrollbar]:hidden">
            <ul className="m-0 flex w-max list-none gap-2 p-0">
              {categoryLinks.map((item) => {
                const active = item.path === currentPath;
                return (
                  <li key={item.path}>
                    <Link
                      ref={active ? activeChipRef : undefined}
                      href={item.path}
                      // Next would jump to the top instantly; we glide there ourselves instead.
                      scroll={false}
                      onClick={glideToTop}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
                        active ? "border-[#171717] bg-[#171717] text-white" : "border-[#DCDCDB] bg-white text-[#171717] hover:border-[#171717]"
                      )}
                    >
                      {t(item.text)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {/* Phones and tablets: one button for sort + filters, set apart from the scrolling chips by a fade and a hairline. */}
          <div className="relative flex shrink-0 items-center border-s border-[#E2DFDA] ps-2.5 lg:border-0 lg:ps-0">
            <span className="pointer-events-none absolute inset-y-0 end-full w-7 from-white to-transparent ltr:bg-gradient-to-l rtl:bg-gradient-to-r lg:hidden" />
            <MobileFilterButton category={category} />
            <div className="hidden lg:block">
              <ProductSort />
            </div>
          </div>
        </div>

        <div className={hasFilters ? "lg:grid lg:grid-cols-[220px_1fr] lg:gap-10" : undefined}>
          {hasFilters && (
            <aside className="hidden lg:block">
              <div className="sticky top-[calc(var(--catalog-top)+64px)] max-h-[calc(100dvh-var(--catalog-top)-64px)] overflow-y-auto pb-6">
                <div className="mb-5 flex h-10 items-center justify-between">
                  <span className="text-base font-semibold text-[#171717]">{tFilter("Filters")}</span>
                  {activeCount > 0 && (
                    <button type="button" onClick={clear} className="text-sm font-medium text-[#6B6B6B] underline decoration-[#C9C5BE] underline-offset-4 transition-colors hover:text-[#171717]">
                      {tFilter("ClearAll")}
                    </button>
                  )}
                </div>
                <ProductsFilter category={category} />
              </div>
            </aside>
          )}
          <ProductsList category={category} />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
