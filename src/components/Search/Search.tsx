"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Search as SearchIcon, X } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Product, ProductsSearchParams } from "@/types/products";
import productsServices from "@/services/productsServices";
import { trackSearch } from "@/lib/fbPixel";
import { SidebarItemsList } from "@/components/Sidebar/model/items";
import { Skeleton } from "@/components/ui/skeleton";
import SearchResultItem from "./_components/SearchResultItem";

interface SearchProps {
  onClose: () => void;
}

const CATEGORY_ITEMS = SidebarItemsList.filter(
  (item) => item.path.startsWith("/products/") && !["/products/all", "/products/sales"].includes(item.path)
);

export default function Search({ onClose }: SearchProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [popular, setPopular] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [popularLoading, setPopularLoading] = useState(true);

  const t = useTranslations("Search");
  const tSidebar = useTranslations("Sidebar");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const timer = useRef<NodeJS.Timeout | null>(null);
  const query = search.trim();

  // Suggestions shown before the visitor types anything.
  useEffect(() => {
    let cancelled = false;
    productsServices
      .getProductsByCategory({ category: "all", language: lng, page: 1, limit: 6, isRandom: "true", availability: "true" })
      .then((data) => { if (!cancelled) setPopular(data?.data?.products || []); })
      .catch(() => { if (!cancelled) setPopular([]); })
      .finally(() => { if (!cancelled) setPopularLoading(false); });
    return () => { cancelled = true; };
  }, [lng]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!query) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const params: ProductsSearchParams = { category: "all", search: query, language: lng, page: 1, limit: 10 };
        const data = await productsServices.getProductsByCategory(params);
        setResults(data?.data?.products || []);
        if (query.length > 2) trackSearch(query);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query, lng]);

  // Lock page scroll and close on Escape.
  useEffect(() => {
    const scrollY = window.scrollY;
    document.documentElement.classList.add("overflow-hidden");
    document.body.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
      window.scrollTo(0, scrollY);
    };
  }, [onClose]);

  const showSuggestions = !query;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-[300] flex flex-col bg-white"
      role="dialog"
      aria-label={t("placeholder")}
    >
      {/* Top bar: exactly the navbar's height */}
      <div className="shrink-0 border-b border-[#E5E5E5]">
        <div className="mx-auto flex h-[var(--navbar-height)] max-w-7xl items-center gap-1 px-2 sm:px-4 lg:px-8">
          <SearchIcon className="ms-2 size-5 shrink-0 text-[#6B6B6B]" strokeWidth={1.75} />
          <input
            type="search"
            autoFocus
            enterKeyHint="search"
            placeholder={t("placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent px-2 text-base text-[#171717] outline-none placeholder:text-[#8A8A8A] [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[#171717] transition-colors hover:bg-[#F5F5F4]"
          >
            <X className="size-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          {showSuggestions ? (
            <div className="space-y-8">
              <section>
                <h2 className="mb-3 text-sm font-medium text-[#6B6B6B]">{t("categories")}</h2>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_ITEMS.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={onClose}
                      className="inline-flex h-10 items-center rounded-full border border-[#DCDCDB] px-4 text-sm font-medium text-[#171717] transition-colors hover:bg-[#F5F5F4]"
                    >
                      {tSidebar(item.text)}
                    </Link>
                  ))}
                  <Link
                    href="/products/all"
                    onClick={onClose}
                    className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#171717] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A2A]"
                  >
                    {t("all_products")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-sm font-medium text-[#6B6B6B]">{t("popular")}</h2>
                {popularLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-[#E5E5E5] p-3">
                        <Skeleton className="size-[72px] rounded-lg" />
                        <div className="flex-1 space-y-2 py-1"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/3" /><Skeleton className="h-4 w-14" /></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {popular.map((product) => (
                      <SearchResultItem key={product._id} product={product} onClose={onClose} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <div className="space-y-4">
              {loading && <p className="text-sm text-[#6B6B6B]">{t("loading")}</p>}
              {!loading && results.length === 0 && query.length > 2 && (
                <p className="text-sm text-[#6B6B6B]">{t("noResults")}</p>
              )}
              {!loading && results.length > 0 && (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {results.map((product) => (
                      <SearchResultItem key={product._id} product={product} onClose={onClose} />
                    ))}
                  </div>
                  {query.length > 2 && (
                    <div className="flex justify-center pt-2">
                      <Link
                        href={`/products/all?search=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#171717] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
                      >
                        {t("viewAllResults")}
                        <ArrowRight className="size-4 rtl:rotate-180" />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
