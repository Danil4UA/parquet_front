"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Product } from "@/types/products";
import useSalesAvailable from "@/hooks/useSalesAvailable";
import SectionHead from "./SectionHead";

export interface CategorySummary {
  category: string;
  count: number;
  minPrice: number;
}

interface CategoryBentoProps {
  /** Photos set on the admin Media page, keyed by slug (wood, laminate, spc, cladding…). */
  categoryImages: Record<string, string>;
  summary: CategorySummary[];
  /** Products with interior photos: used as a fallback tile photo per category. */
  products: Product[];
  language: string;
}

interface Tile {
  slug: string;
  href: string;
  label: string;
  categories: string[]; // backend category names this tile covers
  tall?: boolean;
}

/** Four real product categories as an asymmetric grid, plus a dark "Sale" tile while sales exist. */
const CategoryBento = ({ categoryImages, summary, products, language }: CategoryBentoProps) => {
  const t = useTranslations("HomePage");
  const tSidebar = useTranslations("Sidebar");
  const { salesAvailable } = useSalesAvailable(language);

  const tiles: Tile[] = [
    { slug: "wood", href: "/products/wood", label: tSidebar("wood"), categories: ["Wood"], tall: true },
    { slug: "laminate", href: "/products/laminate", label: tSidebar("laminate"), categories: ["Laminate"] },
    { slug: "spc", href: "/products/spc", label: tSidebar("spc"), categories: ["SPC"] },
    { slug: "cladding", href: "/products/cladding", label: t("panels_cladding"), categories: ["Cladding", "Panels"] },
  ];

  const minPrice = (categories: string[]) => {
    const prices = summary.filter((s) => categories.includes(s.category)).map((s) => s.minPrice).filter((p) => p > 0);
    return prices.length ? Math.min(...prices) : undefined;
  };
  const photo = (tile: Tile) =>
    categoryImages[tile.slug] || products.find((p) => tile.categories.includes(p.category))?.images[0];

  return (
    <section className="py-11 sm:py-[72px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-7">
        <SectionHead
          title={t.rich("categories_title", { strong: (chunks) => <strong>{chunks}</strong> })}
          moreHref="/products/all"
          moreLabel={t("all_catalog")}
        />
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-[1.15fr_1fr_1fr] md:gap-3.5">
          {tiles.map((tile) => {
            const src = photo(tile);
            const price = minPrice(tile.categories);
            return (
              <Link
                key={tile.slug}
                href={tile.href}
                className={`group relative block overflow-hidden rounded-[14px] bg-[#F5F5F4] ${tile.tall ? "row-span-2 min-h-[260px]" : "aspect-square md:aspect-[4/3]"}`}
              >
                {src && <Image src={src} alt={tile.label} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
                <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-0.5 bg-gradient-to-t from-[#171717]/75 via-[#171717]/35 to-transparent p-3 pt-10 text-white sm:p-3.5">
                  <b className="text-[15px] font-semibold leading-tight sm:text-[17px]">{tile.label}</b>
                  {price !== undefined && <span className="text-[11px] opacity-90 sm:text-xs">{t("from_price", { price })}</span>}
                </span>
              </Link>
            );
          })}
          {salesAvailable && (
            <Link href="/products/sales" className="group relative block aspect-square overflow-hidden rounded-[14px] bg-[#171717] md:aspect-[4/3]">
              {categoryImages.sales && (
                <Image src={categoryImages.sales} alt={t("sales_tile")} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              )}
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-0.5 bg-gradient-to-t from-[#171717]/75 via-[#171717]/35 to-transparent p-3 pt-10 text-white sm:p-3.5">
                <b className="text-[15px] font-semibold leading-tight sm:text-[17px]">{t("sales_tile")}</b>
                <span className="text-[11px] opacity-90 sm:text-xs">{t("sales_tile_sub")}</span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryBento;
