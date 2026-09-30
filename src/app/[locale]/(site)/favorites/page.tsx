"use client";

import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";
import { RootState } from "@/redux/store";
import { selectFavorites } from "@/components/Favorites/model/slice/favoritesSlice";
import ProductCard from "@/components/Products/ui/ProductCard/ProductCard";
import PageTitleSection from "@/components/Pages/PageTitleSection";

export default function FavoritesPage() {
  const t = useTranslations("Favorites");
  const favorites = useSelector((state: RootState) => selectFavorites(state));

  return (
    <div className="w-full bg-white">
      <PageTitleSection title={t("page_title")} />
      <div className="mx-auto max-w-[1180px] px-4 pb-11 pt-7 sm:px-7 sm:pb-[72px] sm:pt-10">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F5F4] mb-5">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#171717] mb-2">{t("empty_title")}</h3>
            <p className="text-sm text-[#6B6B6B] max-w-sm">{t("empty_subtitle")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            {favorites.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                className="bg-transparent rounded-lg border-none"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
