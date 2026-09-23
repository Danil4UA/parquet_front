"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Product } from "@/types/products";
import { calculateDiscountedPrice, formatPrice } from "@/Utils/productsUtils";
import SectionHead from "./SectionHead";

interface WorksGridProps {
  products: Product[];
}

/** Real installations: product photos taken on site, each linking to the floor in the catalog. */
const WorksGrid = ({ products }: WorksGridProps) => {
  const t = useTranslations("HomePage");
  const tProduct = useTranslations("ProductPage");
  if (products.length === 0) return null;

  return (
    <section id="works" className="py-11 sm:py-[72px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
        <SectionHead
          title={t.rich("works_title", { strong: (chunks) => <strong>{chunks}</strong> })}
          lead={t("works_lead")}
        />
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3.5">
          {products.map((product) => (
            <Link key={product._id} href={`/products/${product.category}/${product._id}`} className="group flex min-w-0 flex-col gap-1.5">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F5F5F4]">
                <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="min-w-0 text-xs leading-[1.35] text-[#6B6B6B]">
                <b className="block truncate font-medium text-[#171717]">{product.name}</b>
                {formatPrice(calculateDiscountedPrice(product))} {tProduct("per_sqm")}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorksGrid;
