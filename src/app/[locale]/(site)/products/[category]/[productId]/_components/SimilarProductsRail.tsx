"use client";

import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { allProductsByCategory } from "@/constants/queryInfo";
import { Product } from "@/types/products";

interface SimilarProductsRailProps {
  product: Product;
  language: string;
}

const LIMIT = 9;

const SimilarProductsRail: FC<SimilarProductsRailProps> = ({ product, language }) => {
  const t = useTranslations("ProductPage");

  const { data, isPending } = useQuery(
    allProductsByCategory({
      category: product.category,
      color: product.color || "",
      language,
      limit: LIMIT,
      availability: "true",
    })
  );

  const items = (data?.data?.products || []).filter((p) => p._id !== product._id).slice(0, 8);

  if (!isPending && items.length === 0) return null;

  return (
    <section aria-labelledby="similar-title" className="space-y-3">
      <div className="flex items-baseline justify-between gap-3 px-4 sm:px-0">
        <h2 id="similar-title" className="text-lg font-semibold text-[#171717]">
          {t("similar_title")}
        </h2>
        <Link
          href={`/products/${product.category}`}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[#4B4B4B] hover:text-[#171717] transition-colors"
        >
          {t("similar_all")}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>

      <div className="-mx-4 sm:mx-0">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 scroll-px-4 pb-2 sm:px-0 sm:scroll-px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {isPending
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[42vw] max-w-[190px] shrink-0 snap-start">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-1.5 h-4 w-1/3" />
                </div>
              ))
            : items.map((item) => (
                <div key={item._id} className="w-[42vw] max-w-[190px] shrink-0 snap-start">
                  <ProductCard product={item} className="bg-transparent" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProductsRail;
