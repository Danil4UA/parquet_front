"use client";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Link } from "@/i18n/routing";
import "./ProductCard.css";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ImageLoader from "@/widgets/ImageLoader/ImageLoader";
import { Product } from "@/types/products";
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
    stock, 
    finish 
  } = product;

  const productPriceWithDiscount = discount ? Number(productPrice) * ((100 - discount) / 100) : Number(productPrice);
  const [imgSrc, setImgSrc] = useState(images[0]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={classNames("ProductCard", { "out-of-stock": stock === 0 }, [])}>
      <Link
        href={stock === 0 ? "#" : `/products/${category}/${productId}`}
        className="card__media"
        onClick={(e) => stock === 0 && e.preventDefault()}
      >
        <div className="card__image">
          {isLoading && <ImageLoader />}
          <Image 
            src={imgSrc} 
            width={300} 
            height={300} 
            alt={productName} 
            quality={75} 
            onError={() => setImgSrc("/assets/category_flooring.jpg")}
            onLoad={() => setIsLoading(false)}
            className="product-image"
            style={{ opacity: isLoading ? 0 : 1 }}
          />
          {stock === 0 && (
            <div className="card__out_of_stock_overlay">
              <span className="out_of_stock_text">{t("OutOfStock")}</span>
            </div>
          )}
        </div>
        {discount > 0 && <div className="card__sale_badge">-{discount}%</div>}
        <div className="card__information">
          <div>{`${productName} (${finish ? finish : ""})`}</div>
          <div className="card__information_price">
            {discount ? (
              <div className="price__container">
                <span className="price__discounted">
                  <span className="prefix">₪</span>
                  {productPriceWithDiscount.toFixed()}
                </span>
                <span className="price__original">
                  <span className="prefix">₪</span>
                  {productPrice}
                </span>
              </div>
            ) : (
              <span>
                <span className="prefix">₪</span>
                {productPrice}
              </span>
            )}
          </div>
          <div className="card__information_button">{stock === 0 ? t("NotifyWhenAvailable") : t("GetMoreDetails")}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;