import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Sort order lives in the URL next to the filters. */
export const useProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Filter");

  const currentSort = searchParams.get("sortBy") || "";

  const options = [
    { value: "price_asc", label: t("LowToHight") },
    { value: "price_desc", label: t("HightToLow") },
  ];

  const setSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) params.set("sortBy", sortValue);
    else params.delete("sortBy");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // The list is about to change: start it from the top instead of leaving the visitor mid-page.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { currentSort, options, setSort };
};

/** Desktop sort dropdown. On phones and tablets the sort lives inside the filter sheet. */
const ProductSort = () => {
  const t = useTranslations("Filter");
  const { currentSort, options, setSort } = useProductSort();

  return (
    <Select onValueChange={setSort} value={currentSort}>
      <SelectTrigger className="h-10 w-auto max-w-[230px] gap-2 rounded-full border-[#DCDCDB] bg-white px-4 text-sm font-medium text-[#171717] shadow-none transition-colors hover:border-[#171717] focus:ring-[#171717]">
        <SelectValue placeholder={t("SortBy")} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-[#E2DFDA] bg-white">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProductSort;
