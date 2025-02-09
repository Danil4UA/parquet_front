"use client";

import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./productDescription.css";
import { addToCart, setCollapsedСart } from "@/components/Cart/model/slice/cartSlice";
import { Product } from "@/components/Products/ui/ProductsList/ProductsList";
import { useParams } from "next/navigation";
// import QuestionIcon from "@/app/assets/question.svg";
import productsServices from "@/services/prodcuts.services";
import Gallery from "@/components/Gallery/Gallery";
import Loader from "@/shared/ui/Loader/Loader";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const ProductPage: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const language = pathname.split("/")[1];
  const t = useTranslations("Description");

  const dispatch = useDispatch();
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await productsServices.getProductById(productId, language);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError("Failed to fetch product.");
        }
      } catch (error) {
        setError("An error occurred while fetching the product.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, language]);

  const handleAddToCart = () => {
    if (!product) return;
    const newProduct = { ...product, quantity: 1 };
    dispatch(addToCart(newProduct));
    dispatch(setCollapsedСart(false));
  };

  if (isLoading) {
    return (
      <section className="product-wrapper">
        <Loader />
      </section>
    );
  }

  if (error) {
    return (
      <section className="product-wrapper">
        <div className="product__info_wrapper">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="product-wrapper">
        <div className="product__info_wrapper">
          <p>Product not found.</p>
        </div>
      </section>
    );
  }
  console.log(product);
  const productPriceWithDiscount = product.discount ? Number(product.price) * ((100 - product.discount) / 100) : Number(product.discount);

  return (
    <section className="product-wrapper">
      <section className="product-container">
        <div className="product__left">
          <div className="gallery-container">
            <Gallery images={product.images} />
          </div>
        </div>

        <div className="product__info_wrapper">
          <div className="product__header">
            <h1 className="product__name">{product.name}</h1>
            <div className="product__price">
              {product.discount ? (
                <div className="product-price product-price--discounted">
                  <span className="product-price__amount product-price__amount--discounted">
                    <span className="product-price__currency">₪</span>
                    {productPriceWithDiscount.toFixed()}
                  </span>
                  <span className="product-price__amount product-price__amount--original">
                    <span className="product-price__currency">₪</span>
                    {product.price}
                  </span>
                </div>
              ) : (
                <span className="product-price__amount">
                  <span className="product-price__currency">₪</span>
                  {product.price}
                </span>
              )}
            </div>
            <p className="product__notice">{t("product_notice")}</p>
          </div>
          <div className="product__add_cart_container">
            <button className="product__add_cart" onClick={handleAddToCart}>
              {t("button_add_to_cart")}
            </button>
          </div>
          <div className="product__info_delivery">
            <h2 className="delivery__title">{t("delivery_title")}</h2>
            <div className="delivery__item">
              {/* <span className="delivery__indicator"></span> */}
              <p>{t("delivery_pickup")}</p>
            </div>
            <div className="delivery__item">
              {/* <span className="delivery__indicator"></span> */}
              <p>{t("delivery_ready_in")}</p>
            </div>
            <p className="check__store">
              {t("delivery_check_store")}
              {/* <QuestionIcon /> */}
            </p>
          </div>

          <div className="product__section">
            <h2 className="section__title">{t("specifications_title")}</h2>
            <div className="specifications__grid">
              <p className="specification__item">{t("specifications_made_by", { company: product.company })}</p>
              <p className="specification__item">{t("specifications_length", { length: product.length })}</p>
              <p className="specification__item">{t("specifications_width", { width: product.width })}</p>
              <p className="specification__item">{t("specifications_color", { color: product.color })}</p>
            </div>
          </div>

          <div className="product__section">
            <h2 className="section__title">{t("product_description_title")}</h2>
            {/* <p className="product__description">{t("product_description")}</p> */}
            <p>{product.detailedDescription}</p>
          </div>

          <div className="product__section">
            <h2 className="section__title">{t("about_brand_title")}</h2>
            {/* Brand content */}
          </div>

          <div className="product__section">
            <h2 className="section__title">{t("delivery_policy_title")}</h2>
            {/* Delivery policy content */}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProductPage;
