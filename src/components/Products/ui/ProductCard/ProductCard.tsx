"use client";
import { Link } from "@/i18n/routing";
import "./ProductCard.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Product } from "@/types/products";
import { cn } from "@/lib/utils";
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ 
  product,
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
  const [imgSrc, setImgSrc] = useState(images[0]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn(
      "relative w-full bg-white rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-[1.02] group",
      !isAvailable && "opacity-80",
      []
    )}>
      <Link
        href={!isAvailable ? "#" : `/products/${category}/${productId}`}
        className="block"
        onClick={(e) => !isAvailable && e.preventDefault()}
      >
        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          <Image
            src={imgSrc}
            fill
            alt={productName}
            quality={75}
            onError={() => setImgSrc("/assets/category_flooring.jpg")}
            onLoad={() => setIsLoading(false)}
            className={cn(
              "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
              isLoading ? "opacity-0" : "opacity-100",
              []
            )}
            sizes="(max-width: 750px) 50vw, (max-width: 980px) 33vw, 25vw"
            priority={false}
          />

          {discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold z-0">
              -{discount}%
            </div>
          )}

          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 transition-all duration-300 group-hover:bg-black/60">
              <span className="text-white text-lg font-semibold bg-black/70 px-4 py-2 rounded transition-transform duration-300 group-hover:-translate-y-1">
                {t("OutOfStock")}
              </span>
            </div>
          )}
          {isAvailable && (
          <div className="hidden md:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
            <button className={cn(
              "px-6 py-3 rounded-lg font-medium shadow-lg backdrop-blur-sm transition-colors duration-200",
              isAvailable ? "bg-white text-gray-800 hover:bg-gray-100" : "bg-gray-400 text-gray-600 cursor-not-allowed",
              []
            )}>
               {t("GetMoreDetails")}
            </button>
          </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <h3 className="text-lg font-medium text-gray-800 line-clamp-2 leading-tight text-center">
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