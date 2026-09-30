"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Utils from "@/Utils/utils";
import { cn } from "@/lib/utils";

export interface Filters {
  color: string[];
  type: string[];
  material: string[];
}

const FILTER_KEYS: (keyof Filters)[] = ["color", "type", "material"];

/** Catalog filters live in the URL, so a filtered list can be shared and survives a reload. */
export const useProductFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const result: Filters = { color: [], type: [], material: [] };
    FILTER_KEYS.forEach((key) => {
      const param = searchParams.get(key);
      if (param) result[key] = param.split(",");
    });
    return result;
  }, [searchParams]);

  const apply = (next: Filters, dropSort = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (dropSort) params.delete("sortBy");
    FILTER_KEYS.forEach((key) => {
      if (next[key].length > 0) params.set(key, next[key].join(","));
      else params.delete(key);
    });
    const query = params.toString();
    // replace, not push: toggling filters should not pile up entries behind the Back button.
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // The list is about to change: start it from the top instead of leaving the visitor mid-page.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggle = (key: keyof Filters, value: string) => {
    const current = filters[key];
    apply({ ...filters, [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] });
  };

  const clear = () => apply({ color: [], type: [], material: [] });
  /** Filters and the sort order in one navigation (the phone sheet's Reset). */
  const clearWithSort = () => apply({ color: [], type: [], material: [] }, true);
  const activeCount = FILTER_KEYS.reduce((sum, key) => sum + filters[key].length, 0);

  return { filters, toggle, clear, clearWithSort, activeCount };
};

export const filterChipClass = (active: boolean) =>
  cn(
    "inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
    active ? "border-[#171717] bg-[#171717] text-white" : "border-[#DCDCDB] bg-white text-[#171717] hover:border-[#171717]"
  );

interface ProductsFilterProps {
  category: string;
  className?: string;
}

const COLOR_OPTIONS = [
  { value: "smoke", color: "#F2F2F2", label: "Light" },
  { value: "beige", color: "#E8DCC0", label: "Beige" },
  { value: "gray", color: "#808080", label: "Gray" },
  { value: "brown", color: "#8B4513", label: "Brown" },
  { value: "dark", color: "#333333", label: "Dark" },
];

/** Filter groups as toggle chips. Used as the desktop side column and inside the phone sheet. */
const ProductsFilter = ({ category, className }: ProductsFilterProps) => {
  const t = useTranslations("Filter");
  const { filters, toggle } = useProductFilters();

  const config = Utils.filterCategoryConfig[category.toLowerCase()] || Utils.filterCategoryConfig.default;

  const typeOptions = [
    { value: "fishbone", label: t("Fishbone") },
    { value: "plank", label: t("Plank") },
    { value: "cladding", label: t("Cladding") },
  ].filter((option) => !config.excludeTypes.includes(option.value));

  const materialOptions = [
    { value: "spc", label: t("SPC") },
    { value: "laminate", label: t("Laminate") },
    { value: "wood", label: t("Wood") },
    { value: "cladding", label: t("Cladding") },
    { value: "panels", label: t("Panels") },
  ];

  const groups: { key: keyof Filters; title: string; options: { value: string; label: string; color?: string }[] }[] = [];
  if (config.showColorFilter) groups.push({ key: "color", title: t("Color"), options: COLOR_OPTIONS.map((option) => ({ ...option, label: t(option.label) })) });
  if (config.showMaterialFilter) groups.push({ key: "material", title: t("Material"), options: materialOptions });
  if (config.showTypeFilter) groups.push({ key: "type", title: t("Type"), options: typeOptions });

  if (groups.length === 0) return null;

  return (
    <div className={cn("grid gap-6", className)}>
      {groups.map((group) => (
        <fieldset key={group.key} className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-3 p-0 text-sm font-semibold text-[#171717]">{group.title}</legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const active = filters[group.key].includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(group.key, option.value)}
                  className={filterChipClass(active)}
                >
                  {option.color && <span className="size-4 rounded-full border border-black/15" style={{ backgroundColor: option.color }} />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
};

export default ProductsFilter;
