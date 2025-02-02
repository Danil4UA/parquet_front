"use client";
import { classNames } from "@/shared/lib/classNames/classNames";
import { Link } from "@/i18n/routing";
import "./ProductCard.css";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  productId: string;
  productName: string;
  productPrice: string;
  productDescription?: string;
  discount?: number;
  category: string;
  images: string[];
  stock: number;
}

const ProductCard = ({ productId, productName, productPrice, discount = 0, category, images, stock }: ProductCardProps) => {
  const t = useTranslations("Product");
  const productPriceWithDiscount = discount ? Number(productPrice) * ((100 - discount) / 100) : Number(productPrice);

  return (
    <div className={classNames("ProductCard", { "out-of-stock": stock === 0 }, [])}>
      <Link
        href={stock === 0 ? "#" : `/products/${category}/${productId}`}
        className="card__media"
        onClick={(e) => stock === 0 && e.preventDefault()}
      >
        <div className="card__image">
          <Image src={images[0]} width={300} height={300} alt={productName} />
          {stock === 0 && (
            <div className="card__out_of_stock_overlay">
              <span className="out_of_stock_text">{t("OutOfStock")}</span>
            </div>
          )}
        </div>
        {discount > 0 && <div className="card__sale_badge">-{discount}%</div>}
        <div className="card__information">
          <div>{productName}</div>
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
