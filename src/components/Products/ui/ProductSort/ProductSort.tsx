import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useIsMobileDebounce from "@/hooks/useIsMobileDebounce";

const ProductSort = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Filter");
  const { isMobile } = useIsMobileDebounce();

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

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Select onValueChange={handleSortProducts} value={currentSort}>
        <SelectTrigger 
          className={cn(
            "w-[200px] h-8 md:h-10 text-sm transition-all duration-200",
            isMobile
              ? "border border-gray-300 bg-white text-black hover:bg-gray-50"
              : "border border-gray-200/50 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 shadow-sm hover:shadow-md"
          )}
        >
          <SelectValue placeholder={t("SortBy")} />
        </SelectTrigger>
        <SelectContent 
          className={cn(
            isMobile
              ? "bg-white"
              : "bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-lg"
          )}
        >
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="hover:bg-gray-50/80 transition-colors"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default ProductSort;