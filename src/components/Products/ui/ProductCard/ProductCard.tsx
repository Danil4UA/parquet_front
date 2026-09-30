"use client";
import { Link } from "@/i18n/routing";
import "./ProductCard.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Product } from "@/types/products";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/Favorites/FavoriteButton";
// Two cards per row on phones; from there up the grid keeps cards between ~220 and ~300px wide.
// A fixed slot width means the browser does not re-download the photo while the window is resized.
const CARD_IMAGE_SIZES = "(max-width: 639px) 50vw, 300px";

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Load the photo eagerly (cards visible without scrolling). */
  priority?: boolean;
}

const ProductCard = ({ 
  product,
  className,
  priority = false,
}: ProductCardProps) => {
  const t = useTranslations("Product");

  const { 
    _id: productId, 
    name: productName, 
    price: productPrice, 
    discount = 0, 
    category, 
    images, 
    isAvailable,
  } = product;

  const productPriceWithDiscount = discount ? Number(productPrice) * ((100 - discount) / 100) : Number(productPrice);
  const hasSecondImage = images.length > 1 && Boolean(images[1]);
  const [imgSrc] = useState(images[0]);
  const [secondImgSrc, setSecondImgSrc] = useState(images[1]);
  const [isLoading, setIsLoading] = useState(true);
  const [secondLoaded, setSecondLoaded] = useState(false);

  return (
    <div className={cn(
      "relative w-full bg-white rounded-lg overflow-hidden group",
      className,
      []
    )}>
      <FavoriteButton product={product} className="absolute top-2 left-2 z-30" />
      <Link
        href={`/products/${category}/${productId}`}
        className="block overflow-hidden"
      >
        {/* Quiet placeholder while the photo loads (no spinner); the photo then fades in. */}
        <div className={cn("relative aspect-square w-full overflow-hidden rounded-lg bg-[#EFEEEC]", isLoading && "photo-shimmer")}>
          
          <Image
            src={imgSrc}
            fill
            alt={productName}
            quality={75}
            onError={() => setIsLoading(false)}
            onLoad={() => setIsLoading(false)}
            className={cn(
              // Only opacity and transform are animated, so resizing the window never animates the photo itself.
              "w-full h-full object-cover transition-[opacity,transform] duration-500 group-hover:scale-105",
              isLoading ? "opacity-0" : "opacity-100",
              hasSecondImage && secondLoaded && "group-hover:opacity-0"
            )}
            sizes={CARD_IMAGE_SIZES}
            priority={priority}
          />

          {hasSecondImage && (
            <Image
              src={secondImgSrc}
              fill
              alt={productName}
              quality={75}
              onError={() => setSecondImgSrc(imgSrc)}
              onLoad={() => setSecondLoaded(true)}
              className={cn(
                "w-full h-full object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:scale-105",
                secondLoaded && "group-hover:opacity-100"
              )}
              sizes={CARD_IMAGE_SIZES}
              priority={false}
            />
          )}

          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold z-0">
              -{discount}%
            </div>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/15 flex items-center justify-center z-20 transition-all duration-300 group-hover:bg-black/25">
              <span className="text-white text-lg font-semibold bg-black/60 px-4 py-2 rounded transition-transform duration-300 group-hover:-translate-y-1">
                {t("OutOfStock")}
              </span>
            </div>
          )}
        </div>

        <div className="p-2 sm:p-4 flex-1 flex flex-col justify-between">
          <h3 className="text-md font-medium text-gray-800 line-clamp-2 leading-tight text-center">
            {productName}
          </h3>

          <div className="flex items-center justify-center gap-2">
            {discount > 0 ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  ₪{productPriceWithDiscount.toFixed()}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ₪{productPrice}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-800">
                ₪{productPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;