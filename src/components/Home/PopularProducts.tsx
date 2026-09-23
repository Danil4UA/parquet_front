"use client";

import { useTranslations } from "next-intl";
import { Product } from "@/types/products";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import SectionHead from "./SectionHead";

interface PopularProductsProps {
  products: Product[];
}

/** Horizontal rail of products that have an interior photo, in the catalog's default order. */
const PopularProducts = ({ products }: PopularProductsProps) => {
  const t = useTranslations("HomePage");
  if (products.length === 0) return null;

  return (
    <section className="bg-[#F5F5F4] py-11 sm:py-[72px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
        <SectionHead
          title={t.rich("popular_title", { strong: (chunks) => <strong>{chunks}</strong> })}
          moreHref="/products/all"
          moreLabel={t("see_all")}
        />
        <div className="-mx-4 flex snap-x snap-proximity gap-3 overflow-x-auto px-4 pb-1.5 [scroll-padding-inline:16px] [scrollbar-width:none] sm:-mx-7 sm:px-7 sm:[scroll-padding-inline:28px] [&::-webkit-scrollbar]:hidden">
          {products.map((product) => (
            <div key={product._id} className="w-[62%] shrink-0 snap-start sm:w-[calc((100%-5*12px)/6)] sm:min-w-[180px]">
              <ProductCard product={product} className="rounded-xl border-none bg-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
