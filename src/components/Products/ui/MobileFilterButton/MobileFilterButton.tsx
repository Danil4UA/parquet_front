"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import ProductsFilter, { filterChipClass, useProductFilters } from "../ProductsFilter/ProductsFilter";
import { useProductSort } from "../ProductSort/ProductSort";

interface MobileFilterButtonProps {
  category: string;
}

/** Phones and tablets: one icon button (with the number of active choices) that opens sort and filters in a bottom sheet. */
const MobileFilterButton = ({ category }: MobileFilterButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Filter");
  const { activeCount: activeFilters, clearWithSort } = useProductFilters();
  const { currentSort, options: sortOptions, setSort } = useProductSort();
  const activeCount = activeFilters + (currentSort ? 1 : 0);

  // Lock page scroll while the sheet is open and close it on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.documentElement.classList.add("overflow-hidden");
    document.documentElement.setAttribute("data-filter-open", "");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
      document.documentElement.removeAttribute("data-filter-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t("Filters")}
        title={t("Filters")}
        className="relative flex size-10 items-center justify-center rounded-full border border-[#DCDCDB] bg-white text-[#171717] transition-colors hover:border-[#171717] lg:hidden"
      >
        <SlidersHorizontal className="size-[18px]" strokeWidth={1.75} />
        {activeCount > 0 && (
          <span className="absolute -end-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#171717] px-1 text-[11px] font-semibold tabular-nums text-white">{activeCount}</span>
        )}
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[300] bg-black/50"
                  onClick={() => setIsOpen(false)}
                />
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("Filters")}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                  className="fixed inset-x-0 bottom-0 z-[301] mx-auto flex max-h-[85dvh] w-full max-w-[560px] flex-col rounded-t-3xl bg-white shadow-2xl"
                >
                  <div className="flex shrink-0 items-center justify-between border-b border-[#E2DFDA] py-2 pe-2 ps-5">
                    <h2 className="m-0 text-lg font-semibold text-[#171717]">{t("Filters")}</h2>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      aria-label="Close"
                      className="flex size-11 items-center justify-center rounded-full text-[#171717] transition-colors hover:bg-[#F5F5F4]"
                    >
                      <X className="size-6" strokeWidth={1.75} />
                    </button>
                  </div>

                  <div className="grid flex-1 gap-6 overflow-y-auto px-5 py-5">
                    <fieldset className="m-0 min-w-0 border-0 p-0">
                      <legend className="mb-3 p-0 text-sm font-semibold text-[#171717]">{t("SortBy")}</legend>
                      <div className="flex flex-wrap gap-2">
                        {sortOptions.map((option) => {
                          const active = currentSort === option.value;
                          return (
                            <button key={option.value} type="button" aria-pressed={active} onClick={() => setSort(active ? "" : option.value)} className={filterChipClass(active)}>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                    <ProductsFilter category={category} />
                  </div>

                  <div className="flex shrink-0 gap-2.5 border-t border-[#E2DFDA] px-5 pb-[calc(16px+env(safe-area-inset-bottom,0px))] pt-4">
                    <button
                      type="button"
                      onClick={clearWithSort}
                      disabled={activeCount === 0}
                      className="h-[50px] rounded-[14px] border border-[#DCDCDB] px-5 text-[15px] font-semibold text-[#171717] transition-colors hover:bg-[#F5F5F4] disabled:opacity-40"
                    >
                      {t("Reset")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="h-[50px] flex-1 rounded-[14px] bg-[#171717] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2A2A2A]"
                    >
                      {t("Apply")}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};

export default MobileFilterButton;
