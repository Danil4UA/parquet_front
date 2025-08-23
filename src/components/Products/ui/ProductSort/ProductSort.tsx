import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Filter");

  const currentSort = searchParams.get("sortBy") || "";

  const sortOptions = [
    { value: "price_asc", label: t("LowToHight") },
    { value: "price_desc", label: t("HightToLow") },
  ];

  const handleSortProducts = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (sortValue) {
      params.set("sortBy", sortValue);
    } else {
      params.delete("sortBy");
    }

    console.log(`${pathname}?${params.toString()}`);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSortProducts} value={currentSort}>
      <SelectTrigger className="w-[200px] h-8 md:h-10 border text-lg text-black hover:bg-gray-100">
        <SelectValue placeholder={t("SortBy")} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProductSort;
