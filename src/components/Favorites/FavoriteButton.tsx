"use client";

import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import { Product } from "@/types/products";
import { RootState } from "@/redux/store";
import { selectIsFavorited, toggleFavorite } from "./model/slice/favoritesSlice";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  iconSize?: number;
}

const FavoriteButton = ({ product, className, iconSize = 18 }: FavoriteButtonProps) => {
  const t = useTranslations("Favorites");
  const dispatch = useDispatch();
  const isFavorited = useSelector((state: RootState) => selectIsFavorited(product._id)(state));

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigating when the button sits inside a product link.
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isFavorited ? t("remove") : t("add")}
      aria-pressed={isFavorited}
      title={isFavorited ? t("remove") : t("add")}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md transition-all duration-200 hover:scale-110 active:scale-95",
        className
      )}
    >
      <Heart
        size={iconSize}
        className={cn(
          "transition-colors duration-200",
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
        )}
      />
    </button>
  );
};

export default FavoriteButton;
