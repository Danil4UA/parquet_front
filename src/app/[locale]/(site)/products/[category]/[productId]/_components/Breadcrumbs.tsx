import { FC } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import RouteConstants from "@/constants/RouteConstants";
import { CATEGORY_TITLE_KEYS } from "./productPageUtils";

interface BreadcrumbsProps {
  category: string;
  productName: string;
}

const Breadcrumbs: FC<BreadcrumbsProps> = ({ category, productName }) => {
  const t = useTranslations("ProductPage");
  const tCategories = useTranslations("Categories");
  const categoryKey = CATEGORY_TITLE_KEYS[category];
  const categoryLabel = categoryKey ? tCategories(categoryKey) : category;

  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-[#7A7A7A]">
      <ol className="flex items-center gap-1 min-w-0">
        <li className="shrink-0">
          <Link href={RouteConstants.ALL_PRODUCTS_PAGE} className="hover:text-[#171717] transition-colors">
            {t("catalog")}
          </Link>
        </li>
        <li aria-hidden className="shrink-0"><ChevronRight className="size-3.5 rtl:rotate-180" /></li>
        <li className="shrink-0">
          <Link href={`/products/${category}`} className="hover:text-[#171717] transition-colors">
            {categoryLabel}
          </Link>
        </li>
        <li aria-hidden className="shrink-0"><ChevronRight className="size-3.5 rtl:rotate-180" /></li>
        <li className="truncate text-[#4B4B4B]" aria-current="page">{productName}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
